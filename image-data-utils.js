/*
 * Copyright (c) 2011 Kevin Decker (http://www.incaseofstairs.com/)
 * See LICENSE for license information
 */
var ImageDataUtils;

(function() {
const DEFAULT_SNAP_SCAN_RANGE = 10;

function sign(a, b) {
    return (a > b) ? 1 : (a < b) ? -1 : 0;
}

function getPixelIntensity(coord, imageData) {
    var testOffset = ImageDataUtils.getOffset(coord, imageData),
        data = imageData.data;
    return data[testOffset]+data[testOffset+1]+data[testOffset+2]+data[testOffset+3];
}

ImageDataUtils = {
    getCoords: function(offset, imageData) {
        var binWidth = imageData.width * 4;
        return {
            x: offset % binWidth,
            y: offset / binWidth | 0
        };
    },
    getOffset: function(coords, imageData) {
        return (coords.x + coords.y*imageData.width)*4;
    },
    getPixel: function(context, coord) {
        return context.getImageData(coord.x, coord.y, 1, 1).data;
    },
    getWindow: function getSnapToWindow(context, coord, windowSize) {
        var firstPixel = {x: Math.max(coord.x-windowSize, 0), y: Math.max(coord.y-windowSize, 0)};
        return {
            firstPixel: firstPixel,
            focusPixel: {x: coord.x-firstPixel.x, y: coord.y-firstPixel.y},
            imageData: context.getImageData(firstPixel.x, firstPixel.y, 2*windowSize, 2*windowSize)
        };
    },
    getLinePixels: function(context, coordStart, coordEnd) {
        // Extract the rectangle that contains our data
        var containingRect = LineUtils.containingRect(coordStart, coordEnd),
            image = context.getImageData(containingRect.x, containingRect.y, containingRect.width+1, containingRect.height+1),
            imageData = image.data;

        // Determine the properties of our line
        var len = LineUtils.distance(coordStart, coordEnd)|0;
        if (!len) {
            return;
        }

        // Create our destination image
        var line = context.createImageData(len, 1),
            lineData = line.data;

        LineUtils.walkLine(coordStart, coordEnd, function(t, coords) {
            // TODO : Examine what sort of interpolation or averaging we want to do if we have a non-integer component
            // Cast to ints
            coords.x |= 0;
            coords.y |= 0;

            var offset = ImageDataUtils.getOffset(coords, image);

            var lineOffset = t*4;
            lineData[lineOffset]   = imageData[offset];
            lineData[lineOffset+1] = imageData[offset+1];
            lineData[lineOffset+2] = imageData[offset+2];
            lineData[lineOffset+3] = imageData[offset+3];
        });

        return line;
    },
    getInitialSnapToTarget: function(edgeContext, coordStart, scanRange) {
        // Load the window we are concerned with right now
        var snapWindow = ImageDataUtils.getWindow(edgeContext, coordStart, scanRange || DEFAULT_SNAP_SCAN_RANGE),
            focusPixel = snapWindow.focusPixel,
            imageData = snapWindow.imageData,
            data = snapWindow.imageData.data,
            endOffset = ImageDataUtils.getOffset(focusPixel, snapWindow.imageData);

        // Setup our data tracker
        var maximum = focusPixel;
        maximum.distance = 0;
        maximum.intensity = getPixelIntensity(maximum, imageData);

        function checkPixel(coord) {
            var intensity = getPixelIntensity(coord, imageData);

            if (intensity > 256+128) {
                coord.distance = Math.max(Math.abs(coord.x-focusPixel.x), Math.abs(coord.y-focusPixel.y));
                coord.intensity = intensity;
                console.error("checkPixel: " + JSON.stringify(maximum) + " " + JSON.stringify(coord));
                if ((coord.distance-maximum.distance || maximum.intensity-coord.intensity) > 0) {
                    maximum = coord;
                }
            }
        }

        // Scan the window for any pixels that are dratically different
        var y = imageData.height;
        while (y--) {
            // Intensity here should somehow be a delta to find edges that are against transparent sections (or the edge finder needs to start examining transparency)
            checkPixel({x: focusPixel.x, y: y});
        }

        var x = imageData.width;
        while (x--) {
            checkPixel({x: x, y: focusPixel.y});
        }

        // Move the return one pixel further along the path
        maximum.x = maximum.x+sign(maximum.x, focusPixel.x)+snapWindow.firstPixel.x;
        maximum.y = maximum.y+sign(maximum.y, focusPixel.y)+snapWindow.firstPixel.y;

        return maximum;
    },
    createCanvasFromImageData: function(imageData) {
        var canvas = document.createElement("canvas");
        canvas.setAttribute("width", imageData.width);
        canvas.setAttribute("height", imageData.height);

        var context = canvas.getContext("2d");
        context.putImageData(imageData, 0, 0);

        return canvas;
    },
};
})();
