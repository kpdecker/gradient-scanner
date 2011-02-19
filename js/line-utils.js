/*
 * Copyright (c) 2011 Kevin Decker (http://www.incaseofstairs.com/)
 * See LICENSE for license information
 */
var LineUtils;

(function() {

function getUnit(value) {
    if (typeof value === "number") {
        return value ? "px" : 0;
    }

    if (parseFloat(value) === 0) {
        return 0;
    }
    return (/\d+(?:\.\d+)?(.*)/).exec(value)[1] || "px";
}
function checkUnit(unit, value) {
    var newUnit = getUnit(value);
    if (unit === 0 || unit === newUnit) {
        return newUnit;
    } else if (newUnit === 0) {
        return unit;
    } else {
        return false;
    }
}
function combineUnit(magnitude, unit) {
    if (!magnitude || unit === "px") {
        return magnitude;
    } else {
        return magnitude + unit;
    }
}

LineUtils = {
    /**
     * Retrieves the unit from a given value (defaulting to pixels if undefined)
     */
    getUnit: getUnit,

    /**
     * Determines the minimum rectangle that will cover the line segment with the given endpoints and optionally width
     */
    containingRect: function(start, end, width) {
        var unit = 0;
        unit = checkUnit(unit, start.x);
        unit = checkUnit(unit, start.y);
        unit = checkUnit(unit, end.x);
        unit = checkUnit(unit, end.y);
        if (width) {
            unit = checkUnit(unit, width);
        }
        if (unit === false) {
            return NaN;
        }

        // Remove any units, we'll restore them later
        start = {x: parseFloat(start.x), y: parseFloat(start.y)};
        end = {x: parseFloat(end.x), y: parseFloat(end.y)};
        width = parseFloat(width);

        var topLeft = {x: Math.min(start.x, end.x), y: Math.min(start.y, end.y)},
            bottomRight = {x: Math.max(start.x, end.x), y: Math.max(start.y, end.y)};

        if (width) {
            var angle = LineUtils.slopeInRads(start, end),
                horz = Math.floor(width*Math.abs(Math.sin(angle))/2),
                vert = Math.floor(width*Math.abs(Math.cos(angle))/2);
            topLeft.x -= horz;
            topLeft.y -= vert;
            bottomRight.x += horz;
            bottomRight.y += vert;
        }

        return {
            x: combineUnit(topLeft.x, unit),
            y: combineUnit(topLeft.y, unit),
            width: combineUnit(Math.max(bottomRight.x-topLeft.x, 1), unit),
            height: combineUnit(Math.max(bottomRight.y-topLeft.y, 1), unit)
        };
    },

    /**
     * Returns the relative position for a given coord, relative to a specific origin.
     */
    relativeCoords: function(coord, origin) {
        var unit = 0;
        unit = checkUnit(unit, coord.x);
        unit = checkUnit(unit, coord.y);
        unit = checkUnit(unit, origin.x);
        unit = checkUnit(unit, origin.y);
        if (unit === false) {
            return NaN;
        }

        return {
            x: combineUnit(parseFloat(coord.x)-parseFloat(origin.x), unit),
            y: combineUnit(parseFloat(coord.y)-parseFloat(origin.y), unit)
        };
    },

    /**
     * Determines the distance between two points. The units of this value are the same as those input. For the percentage case,
     * distance is distance covered within the plane of a square with demensions of 100% x 100%. This can not be mapped back
     * to a fixed unit space directly.
     */
    distance: function(start, end) {
        // Check that the units match
        var unit = 0;
        unit = checkUnit(unit, start.x);
        unit = checkUnit(unit, start.y);
        unit = checkUnit(unit, end.x);
        unit = checkUnit(unit, end.y);
        if (unit === false) {
            return NaN;
        }

        return Math.sqrt(Math.pow(parseFloat(end.y)-parseFloat(start.y),2) + Math.pow(parseFloat(end.x)-parseFloat(start.x), 2));
    },

    /**
     * Calculates the percentage of the ray length that a line segment covers, when the ray is constrained by the given container.
     * @return percentage value [0, 1]
     */
    percentageOfRay: function(start, end, container) {
        // Check that the units match
        var unit = 0;
        unit = checkUnit(unit, start.x);
        unit = checkUnit(unit, start.y);
        unit = checkUnit(unit, end.x);
        unit = checkUnit(unit, end.y);
        unit = checkUnit(unit, container.x);
        unit = checkUnit(unit, container.y);
        unit = checkUnit(unit, container.width);
        unit = checkUnit(unit, container.height);
        if (unit === false) {
            return NaN;
        }

        var intercepts = LineUtils.lineIntercepts(start, end, container, true);
        if (!intercepts.length) {
            return 0;
        }

        var rayDistance = LineUtils.distance(start, intercepts[intercepts.length-1]),
            segmentDistance = LineUtils.distance(start, end);
        return segmentDistance/rayDistance;
    },

    isOnEdge: function(point, container) {
        // Check that the units match
        var unit = 0;
        unit = checkUnit(unit, point.x);
        unit = checkUnit(unit, point.y);
        unit = checkUnit(unit, container.x);
        unit = checkUnit(unit, container.y);
        unit = checkUnit(unit, container.width);
        unit = checkUnit(unit, container.height);
        if (unit === false) {
            return NaN;
        }

        point = {x: parseFloat(point.x), y: parseFloat(point.y)};
        container = {
            x: parseFloat(container.x), y: parseFloat(container.y),
            width: parseFloat(container.width), height: parseFloat(container.height)
        };

        if (point.x === container.x || point.x === container.x+container.width) {
            return container.y <= point.y && point.y <= container.y + container.height;
        } else if (point.y === container.y || point.y === container.y+container.height) {
            return container.x <= point.x && point.x <= container.x + container.width;
        } else {
            return false;
        }
    },

    /**
     * Calculates the gradient start and end points as defined by http://dev.w3.org/csswg/css3-images/#linear-gradients
     * as well as the color stop adjustment values to fix the color stops to an centroid angle gradient.
     */
    gradientPoints: function(start, end, container) {
        // Check that the units match
        var unit = 0;
        unit = checkUnit(unit, start.x);
        unit = checkUnit(unit, start.y);
        unit = checkUnit(unit, end.x);
        unit = checkUnit(unit, end.y);
        unit = checkUnit(unit, container.x);
        unit = checkUnit(unit, container.y);
        unit = checkUnit(unit, container.width);
        unit = checkUnit(unit, container.height);
        if (unit === false) {
            return NaN;
        }

        start = {x: parseFloat(start.x), y: parseFloat(start.y)};
        end = {x: parseFloat(end.x), y: parseFloat(end.y)};
        container = {
            x: parseFloat(container.x), y: parseFloat(container.y),
            width: parseFloat(container.width), height: parseFloat(container.height)
        };

        var rise = end.y-start.y,
            run = end.x-start.x,
            slope = rise/run,
            perpendicularSlope = -1/slope,

            top = container.y,
            bottom = container.y + container.height,
            left = container.x,
            right = container.x + container.width,
            center = {x: container.x + container.width/2, y: container.y + container.height/2},

            startCorner, endCorner, passedCornerIntercept, totalDist;

        function findLineIntersect(point1, slope1, point2, slope2) {
            var retX = (point1.y - point2.y + slope2*point2.x - slope1*point1.x)/(slope2 - slope1);
            return {
                x: retX,
                y: slope1*(retX - point1.x) + point1.y
            };
        }

        // Special case the vertical and horizontal as they or their perpendicular have the lil divide by zero concern
        if (!run) {
            startCorner = {x: center.x, y: end.y<start.y?bottom:top};
            endCorner = {x: center.x, y: end.y>start.y?bottom:top};
            passedCornerIntercept = {x: start.x, y: startCorner.y};
        } else if (!rise) {
            // Corners are the vertical intercepts
            startCorner = {x: end.x<start.x?right:left, y: center.y};
            endCorner = {x: end.x>start.x?right:left, y: center.y};
            passedCornerIntercept = {x: startCorner.x, y: start.y};
        } else if (slope < 0) {
            // The corners are (0,h) and (w,0)
            var topRight = findLineIntersect({x:right, y:top}, perpendicularSlope, center, slope),
                bottomLeft = findLineIntersect({x:left, y:bottom}, perpendicularSlope, center, slope);

            startCorner = run < 0 ? topRight : bottomLeft;
            endCorner = run < 0 ? bottomLeft : topRight;
            passedCornerIntercept = findLineIntersect(start, slope, startCorner, perpendicularSlope);
        } else {
            // The corners are (0,0) and bottom (w,h)
            var topLeft = findLineIntersect({x:left, y:top}, perpendicularSlope, center, slope),
                bottomRight = findLineIntersect({x:right, y:bottom}, perpendicularSlope, center, slope);

            startCorner = run < 0 ? bottomRight : topLeft;
            endCorner = run < 0 ? topLeft : bottomRight;
            passedCornerIntercept = findLineIntersect(start, slope, startCorner, perpendicularSlope);
        }

        totalDist = LineUtils.distance(startCorner, endCorner);
        return {
            start: {x: combineUnit(startCorner.x, unit), y: combineUnit(startCorner.y, unit)},
            startOff: LineUtils.distance(passedCornerIntercept, start)/totalDist,
            end: {x: combineUnit(endCorner.x, unit), y: combineUnit(endCorner.y, unit)},
            scale: LineUtils.distance(start, end)/totalDist
        };
    },

    /**
     * Determines the two points at which the line connecting start and end intersects with the container
     * boundaries.
     */
    lineIntercepts: function(start, end, container, ray) {
        // Check that the units match
        var unit = 0;
        unit = checkUnit(unit, start.x);
        unit = checkUnit(unit, start.y);
        unit = checkUnit(unit, end.x);
        unit = checkUnit(unit, end.y);
        unit = checkUnit(unit, container.x);
        unit = checkUnit(unit, container.y);
        unit = checkUnit(unit, container.width);
        unit = checkUnit(unit, container.height);
        if (unit === false) {
            return NaN;
        }

        start = {x: parseFloat(start.x), y: parseFloat(start.y)};
        end = {x: parseFloat(end.x), y: parseFloat(end.y)};
        container = {
            x: parseFloat(container.x), y: parseFloat(container.y),
            width: parseFloat(container.width), height: parseFloat(container.height)
        };

        var rise = end.y-start.y,
            run = end.x-start.x,
            slope = rise/run,
            b = (start.y*end.x - end.y*start.x)/run,

            intercepts = [],

            x, y,
            len, check;

        // Special case the vertical
        if (!run) {
            if (container.x <= end.x && end.x <= container.x+container.width) {
                intercepts = [{x: end.x, y: container.y+(end.y<start.y?container.height:0)}, {x: end.x, y: container.y+(end.y>start.y?container.height:0)}];

                len = intercepts.length;
                while (len--) {
                    check = intercepts[len];
                    if (ray && (rise>0 ? check.y<start.y : check.y>start.y)) {
                        intercepts.splice(len, 1);
                    }

                    check.x = combineUnit(check.x, unit);
                    check.y = combineUnit(check.y, unit);
                }

                return intercepts;
            } else {
                return [];
            }
        }

        // 4 possible intercepts (of which two will be selected)
        // 1) y = container.y
        x = (container.y - b)/slope;
        if (container.x <= x  && x <= container.x+container.width) {
            intercepts.push({x: x, y: container.y});
        }

        // 2) x === container.x
        y = slope*container.x + b;
        if (container.y <= y && y <= container.y+container.height) {
            intercepts.push({x: container.x, y: y});
        }

        // 3) y === container.y+container.height
        x = (container.y+container.height - b)/slope;
        if (container.x <= x  && x <= container.x+container.width) {
            intercepts.push({x: x, y: container.y+container.height});
        }

        // 4) x === container.x+container.width
        y = slope*(container.x+container.width) + b;
        if (container.y <= y && y <= container.y+container.height) {
            intercepts.push({x: container.x+container.width, y: y});
        }

        // Order the elements so the first is the entering intercept and the later is the leaving
        intercepts.sort(function(a, b) { return run>0? a.x-b.x : b.x-a.x; });

        // Remove any duplicates or entries before the ray start and restore the units
        len = intercepts.length;
        x = undefined;
        while (len--) {
            check = intercepts[len];
            if (check.x === x || (ray && (run>0 ? check.x<start.x : check.x>start.x))) {
                intercepts.splice(len, 1);
            }
            x = check.x;

            check.x = combineUnit(check.x, unit);
            check.y = combineUnit(check.y, unit);
        }

        return intercepts;
    },

    /**
     * Determines the angle, in radians of the line connected by these two points.
     * Range: [0, 2PI]
     */
    slopeInRads: function(start, end) {
        // Check that the units match
        var unit = 0;
        unit = checkUnit(unit, start.x);
        unit = checkUnit(unit, start.y);
        unit = checkUnit(unit, end.x);
        unit = checkUnit(unit, end.y);
        if (unit === false) {
            return NaN;
        }

        var rise = parseFloat(end.y)-parseFloat(start.y),
            run = parseFloat(end.x)-parseFloat(start.x);
        return (run<0 ? Math.PI : (rise<0 ? 2*Math.PI : 0)) + (run ? Math.atan(rise/run) : (rise<0?-1:1)*Math.PI/2);
    },
    radsToDegrees: function(rads) {
        return 180*rads/Math.PI;
    },
    walkLine: function(start, end, callback) {
        // Determine the properties of our line
        var rise = end.y-start.y,
            run = end.x-start.x,
            xIntercept = start.x-Math.min(start.x, end.x),
            yIntercept = start.y-Math.min(start.y, end.y),
            distance = LineUtils.distance(start, end),

            len = distance|0;
        if (!len) {
            return len;
        }

        // Scale the run and rise for each integer step
        run /= len;
        rise /= len;

        // Walk the parameterized line
        for (var t = 0; t < len; t++) {
            callback(t, {
                x: (run*t + xIntercept),
                y: (rise*t + yIntercept)
            });
        }
        return len;
    }
};

})();
