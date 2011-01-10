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

        return ret;
    };

    ColorStops.generateCSS = function(colorStops) {
        var stopCSS = colorStops.map(function(stop) {
            return "color-stop(" + stop.position + ", RGBA(" + stop.color.join(", ") + "))";
        }).join(", ");

        return "-webkit-gradient(linear, left top, right top, " + stopCSS + ")";
    };
})();
