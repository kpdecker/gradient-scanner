/*
 * Copyright (c) 2011 Kevin Decker (http://www.incaseofstairs.com/)
 * See LICENSE for license information
 */
var LineUtils;

(function() {

function getUnit(value) {
    if (parseInt(value) == 0) {
        return 0;
    }
    return /\d+(.*)/.exec(value)[1] || "px";
}
function checkUnit(unit, value) {
    var newUnit = getUnit(value);
    return !newUnit || unit === newUnit;
}

LineUtils = {
    /**
     * Retrieves the unit from a given value (defaulting to pixels if undefined)
     */
    getUnit: getUnit,

    containingRect: function(start, end, width) {
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
            x: topLeft.x,
            y: topLeft.y,
            width: Math.max(bottomRight.x-topLeft.x, 1),
            height: Math.max(bottomRight.y-topLeft.y, 1)
        };
    },

    distance: function(start, end) {
        return Math.sqrt(Math.pow(end.y-start.y,2) + Math.pow(end.x-start.x, 2));
    },
    /**
     * Determines the angle, in radians of the line connected by these two points.
     * Range: [0, 2PI]
     */
    slopeInRads: function(start, end) {
        // Check that the units match
        var unit = getUnit(start.x) || getUnit(start.y)
                || getUnit(end.x) || getUnit(end.y);
        if (unit && (
            !checkUnit(unit, start.x) || !checkUnit(unit, start.y)
            || !checkUnit(unit, end.x) || !checkUnit(unit, end.y))) {
            return NaN;
        }

        var rise = parseInt(end.y)-parseInt(start.y),
            run = parseInt(end.x)-parseInt(start.x);
        return (run<0 ? Math.PI : (rise<0 ? 2*Math.PI : 0)) + (run ? Math.atan(rise/run) : (rise<0?-1:1)*Math.PI/2);
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
