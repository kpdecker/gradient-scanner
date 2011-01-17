/*
 * Copyright (c) 2011 Kevin Decker (http://www.incaseofstairs.com/)
 * See LICENSE for license information
 */
var ColorStops = {};

(function() {
    ColorStops.JND = 2.39;

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

    function RGBtoXYZ(color) {
        // Algorithm from http://www.brucelindbloom.com/Eqn_RGB_to_XYZ.html
        var R = color[0] / 255,
            G = color[1] / 255,
            B = color[2] / 255;

        // Inverse Gamma Compounding, using Adobe RGB (1998) color
        //      http://www.brucelindbloom.com/WorkingSpaceInfo.html#Specifications
        var r = Math.pow(R, 2.2),
            g = Math.pow(G, 2.2),
            b = Math.pow(B, 2.2);

        // Constants here are constructed from the M value for Adobe RGB (1998) defined
        // here: http://www.brucelindbloom.com/Eqn_RGB_XYZ_Matrix.html
        return [
            (0.5767309*r + 0.1855540*b + 0.1881852*g),
            (0.2973769*r + 0.6273491*b  + 0.0752741*g),
            (0.0270343*r + 0.0706872*b + 0.9911085*g)
        ];
    }
    function XYZtoLAB(color) {
        // Algorithm from: http://www.brucelindbloom.com/Eqn_XYZ_to_Lab.html
        const X_r=0.95047, Y_r=1.00, Z_r=1.08883,
            EPSILON = 0.008856,
            KAPPA = 903.3;

        var x = color[0]/X_r,
            y = color[1]/X_r,
            z = color[2]/X_r;

        function f_(a) {
            if (a > EPSILON) {
                return Math.pow(a, 1/3);
            } else {
                return (KAPPA*a+16)/116;
            }
        }
        var f_x = f_(x),
            f_y = f_(y),
            f_z = f_(z);

        return [
            116*f_y-16,
            500*(f_x-f_z),
            200*(f_y-f_z)
        ];
    }
    function deltaE(color1, color2) {
        color1 = XYZtoLAB(RGBtoXYZ(color1));
        color2 = XYZtoLAB(RGBtoXYZ(color2));

        return Math.sqrt(Math.pow(color2[0]-color1[0], 2)+Math.pow(color2[1]-color1[1], 2)+Math.pow(color2[2]-color1[2], 2));
    }
    function colorsApproxEqual(color1, color2, dELimit) {
        const ALPHA_EPSILON = 256*0.1;

        var dE = deltaE(color1, color2);
        return dE <= dELimit
            && Math.abs(color1[3]-color2[3]) <= ALPHA_EPSILON;
    }
    function stopsLinear(prev, cur, next, dELimit) {
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

        return colorsApproxEqual(cur.color, curEstimate, dELimit);
    }
    function cullDuplicates(stops, dELimit) {
        const EDGE_DISTANCE = 0.01;

        dELimit = dELimit || ColorsStops.JND;
        if (stops.length < 2) {
            return;
        }

        // Special case for the first to remove any repeating sections
        if (stops[1].position-stops[0].position > EDGE_DISTANCE
                && colorsApproxEqual(stops[0].color, stops[1].color, dELimit)) {
            stops.splice(0, 1);
        }

        // Check to see if the current element is on the same line as the previous and next. If so remove.
        var len = stops.length;
        for (var i = 1; i < len-1; i++) {
            if (stopsLinear(stops[i-1], stops[i], stops[i+1], dELimit)) {
                stops.splice(i, 1);
                i--;    len--;
            }
        }

        // Another special case for the last to remove any repeating sections
        if (len >= 2
                && stops[len-1].position-stops[len-2].position > EDGE_DISTANCE
                && colorsApproxEqual(stops[len-2].color, stops[len-1].color, dELimit)) {
            stops.splice(len-1, 1);
        }
    }

    ColorStops.extractColorStops = function(lineData, dELimit) {
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
            var prevAverage = totalDelta/runCount,
                deltaVariance = Math.abs(prevAverage-delta);
            if (runCount && (0.5*prevAverage < deltaVariance || prevAverage*2 < deltaVariance)) {
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

        cullDuplicates(ret, dELimit)
        return ret;
    };

    ColorStops.generateCSS = function(colorStops) {
        var stopCSS = colorStops.filter(function(stop) {
            return !stop.disabled;
        }).map(function(stop) {
            return "color-stop(" + stop.position + ", RGBA(" + stop.color.join(", ") + "))";
        }).join(", ");

        return "-webkit-gradient(linear, left top, right top, " + stopCSS + ")";
    };
})();
