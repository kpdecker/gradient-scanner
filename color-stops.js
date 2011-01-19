/*
 * Copyright (c) 2011 Kevin Decker (http://www.incaseofstairs.com/)
 * See LICENSE for license information
 */
var ColorStops = {};

(function() {
    ColorStops.JND = 2.39;

    function slopeChanged(oldDeriv, newDeriv) {
        if (!oldDeriv[0] && !oldDeriv[1] && !oldDeriv[2] && !oldDeriv[3]) {
            return false;
        }

        if (!newDeriv[0] && !newDeriv[1] && !newDeriv[2] && !newDeriv[3]) {
            return true;
        }

        return (newDeriv[0] && (oldDeriv[0]<0 !== newDeriv[0]<0))
            || (newDeriv[1] && (oldDeriv[1]<0 !== newDeriv[1]<0))
            || (newDeriv[2] && (oldDeriv[2]<0 !== newDeriv[2]<0))
            || (newDeriv[3] && (oldDeriv[3]<0 !== newDeriv[3]<0));
    }
    function updateDeriv(oldDeriv, newDeriv) {
        return [
                newDeriv[0] || oldDeriv[0],
                newDeriv[1] || oldDeriv[1],
                newDeriv[2] || oldDeriv[2],
                newDeriv[3] || oldDeriv[3],
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
            deriv = [0, 0, 0, 0],
            secDeriv = [0, 0, 0, 0],
            ret = [];

        // We always have a color stop on the first pixel
        ret.push({
            position: 0.0,
            color: last
        });

        // Scan through the remaining pixels looking for any of our possible triggers, err on the side of false
        // positives (which may be culled in the next step)
        var totalDelta = 0,
            runCount = 0;
        for (var i = 4; i < len; i += 4) {
            var cur = [lineData[i], lineData[i+1], lineData[i+2], lineData[i+3]],
                newDeriv = [cur[0]-last[0], cur[1]-last[1], cur[2]-last[2], cur[3]-last[3]],
                newSecDeriv = [newDeriv[0]-deriv[0], newDeriv[1]-deriv[1], newDeriv[2]-deriv[2], newDeriv[3]-deriv[3]],
                delta = Math.abs(newDeriv[0]) + Math.abs(newDeriv[1]) + Math.abs(newDeriv[2]) + Math.abs(newDeriv[3]);

            // Check to see if this is a drastic change in derivative from the previous trend
            var prevAverage = totalDelta/runCount,
                deltaVariance = Math.abs(prevAverage-delta);
            if (runCount && prevAverage < 0.75*deltaVariance) {
                ret.push({
                    position: i / len,
                    color: last
                });
                ret.push({
                    position: i / len,
                    color: cur
                });
                totalDelta = 0;
                runCount = 0;
            } else {
                totalDelta += delta;
                runCount++;
            }

            // Check for a zero crossing in the first or second dervative
            if (slopeChanged(deriv, newDeriv) || slopeChanged(secDeriv, newSecDeriv)) {
                ret.push({
                    position: i / len,
                    color: cur
                });
                deriv = newDeriv;
                secDeriv = newSecDeriv;
            }

            last = cur;
            deriv = updateDeriv(deriv, newDeriv);
            secDeriv = updateDeriv(secDeriv, newSecDeriv);
        }

        ret.push({
            position: 1.0,
            color: last
        });

        // Clear out any stops that do not provide additional data (per configurable dELimit)
        cullDuplicates(ret, dELimit);

        // Make the position values nice and clean
        ret.forEach(function(stop) {
            stop.position = Math.floor(stop.position*1000)/1000;
        });

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
