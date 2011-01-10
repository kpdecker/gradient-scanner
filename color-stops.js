/*
 * Copyright (c) 2011 Kevin Decker (http://www.incaseofstairs.com/)
 * See LICENSE for license information
 */
var ColorStops = {};

(function() {
    function slopeChanged(oldDirv, newDirv) {
        if (!oldDirv[0] && !oldDirv[1] && !oldDirv[2] && !oldDirv[3]) {
            return false;
        }

        return (newDirv[0] && (oldDirv[0]<0 !== newDirv[0]<0))
            || (newDirv[1] && (oldDirv[1]<0 !== newDirv[1]<0))
            || (newDirv[2] && (oldDirv[2]<0 !== newDirv[2]<0))
            || (newDirv[3] && (oldDirv[3]<0 !== newDirv[3]<0));
    }
    function updateDirv(oldDirv, newDirv) {
        return [
                newDirv[0] || oldDirv[0],
                newDirv[1] || oldDirv[1],
                newDirv[2] || oldDirv[2],
                newDirv[3] || oldDirv[3],
            ];
    }

    function colorsApproxEqual(color1, color2) {
        const EPSILON = 256*0.01;

        return Math.abs(color1[0]-color2[0]) <= EPSILON
            && Math.abs(color1[1]-color2[1]) <= EPSILON
            && Math.abs(color1[2]-color2[2]) <= EPSILON
            && Math.abs(color1[3]-color2[3]) <= EPSILON;
    }
    function cullDuplicates(stops) {
        if (stops.length < 2) {
            return;
        }

        // Special case for the first to remove any repeating sections
        if (colorsApproxEqual(stops[0].color, stops[1].color)) {
            stops.splice(0, 1);
        }

        // Check to see if the current element is on the same line as the previous and next. If so remove.
        var len = stops.length;
        for (var i = 1; i < len-1; i++) {
            var prev = stops[i-1],
                cur = stops[i],
                next = stops[i+1];

            var deltaX = next.position-prev.position,
                slope = [
                    (next.color[0]-prev.color[0])/deltaX,
                    (next.color[1]-prev.color[1])/deltaX,
                    (next.color[2]-prev.color[2])/deltaX,
                    (next.color[3]-prev.color[3])/deltaX
                ],
                curDeltaX = cur.position-prev.position,
                curEstimate = [
                    prev.color[0]+slope[0]*curDeltaX | 0,
                    prev.color[1]+slope[1]*curDeltaX | 0,
                    prev.color[2]+slope[2]*curDeltaX | 0,
                    prev.color[3]+slope[3]*curDeltaX | 0
                ];

            if (colorsApproxEqual(cur.color, curEstimate)) {
                stops.splice(i, 1);
                i--;    len--;
            }
        }

        // Another special case for the last to remove any repeating sections
        if (colorsApproxEqual(stops[len-2].color, stops[len-1].color)) {
            stops.splice(len-1, 1);
        }
    }

    ColorStops.extractColorStops = function(lineData) {
        var len = lineData.length,
            last = [lineData[0], lineData[1], lineData[2], lineData[3]],
            dirv = [0, 0, 0, 0],
            ret = [];

        // We always have a color stop on the first pixel
        ret.push({
            position: 0.0,
            color: last
        });

        // Scan through the remaining pixels looking for points that the derivative components cross the
        // x-axis.
        // TODO : Handle outliers where the slope remains in the same direction, but the jump is large enough to break
        //          the interpolation.
        // TODO : Handle cases where a color stop forces a quicker or slower progression (but does not trigger either of the other cases)
        var totalDelta = 0,
            runCount = 0;
        for (var i = 4; i < len; i += 4) {
            var cur = [lineData[i], lineData[i+1], lineData[i+2], lineData[i+3]],
                newDirv = [cur[0]-last[0], cur[1]-last[1], cur[2]-last[2], cur[3]-last[3]],
                delta = Math.abs(newDirv[0]) + Math.abs(newDirv[1]) + Math.abs(newDirv[2]) + Math.abs(newDirv[3]);

            // Check to see if this is a drastic change in derivative from the previous trend
            var prevAverage = totalDelta/runCount;
            if (runCount && Math.abs(prevAverage-delta) > (prevAverage*2)) {
                ret.push({
                    position: i / len,
                    color: last
                });
                totalDelta = delta;
                runCount = 1;
            } else {
                totalDelta += delta;
                runCount++;
            }

            if (delta > 50 || slopeChanged(dirv, newDirv)) {
                ret.push({
                    position: i / len,
                    color: cur
                });
                dirv = newDirv;
            }

            last = cur;
            dirv = updateDirv(dirv, newDirv);
        }

        ret.push({
            position: 1.0,
            color: last
        });

        cullDuplicates(ret)
        return ret;
    };

    ColorStops.generateCSS = function(colorStops) {
        var stopCSS = colorStops.map(function(stop) {
            return "color-stop(" + stop.position + ", RGBA(" + stop.color.join(", ") + "))";
        }).join(", ");

        return "-webkit-gradient(linear, left top, right top, " + stopCSS + ")";
    };
})();
