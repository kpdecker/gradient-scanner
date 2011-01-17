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

function getPixelDelta(coord, endOffset, imageData) {
    var testOffset = ImageDataUtils.getOffset(coord, imageData),
        data = imageData.data;

    return Math.abs(data[endOffset]-data[testOffset])
            + Math.abs(data[endOffset+1]-data[testOffset+1])
            + Math.abs(data[endOffset+2]-data[testOffset+2])
            + Math.abs(data[endOffset+3]-data[testOffset+3]);
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
            imageData: context.getImageData(
                firstPixel.x,
                firstPixel.y,
                Math.min(2*windowSize, context.canvas.width-firstPixel.x),
                Math.min(2*windowSize, context.canvas.height-firstPixel.y))
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
            var firstCoord = {x: Math.floor(coords.x), y: Math.floor(coords.y)},
                nextCoord = {x: Math.floor(coords.x), y: Math.ceil(coords.y)};

            var firstOffset = ImageDataUtils.getOffset(firstCoord, image),
                nextOffset = ImageDataUtils.getOffset(nextCoord, image);

            var xPercentage = 1-(coords.x-firstCoord.x),
                yPercentage = 1-(coords.y-firstCoord.y);
            function calcComponent(offset1, offset2) {
                return imageData[offset1 ]*xPercentage*yPercentage
                    + (imageData[offset1+4]||0)*(1-xPercentage)*yPercentage
                    + (imageData[offset2  ]||0)*xPercentage*(1-yPercentage)
                    + (imageData[offset2+4]||0)*(1-xPercentage)*(1-yPercentage);
            }

            var lineOffset = t*4;
            lineData[lineOffset]   = calcComponent(firstOffset,   nextOffset);
            lineData[lineOffset+1] = calcComponent(firstOffset+1, nextOffset+1);
            lineData[lineOffset+2] = calcComponent(firstOffset+2, nextOffset+2);
            lineData[lineOffset+3] = calcComponent(firstOffset+3, nextOffset+3);
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
        maximum.distance = Infinity;
        maximum.delta = 0;

        function checkPixel(coord) {
            var delta = getPixelDelta(coord, endOffset, imageData);

            if (delta > 128) {
                coord.distance = Math.max(Math.abs(coord.x-focusPixel.x), Math.abs(coord.y-focusPixel.y));
                coord.delta = delta;
                if (coord.distance && (maximum.distance-coord.distance || coord.delta-maximum.delta) > 0) {
                    maximum = coord;
                }
            }
        }

        // Scan the window for any pixels that are dratically different
        var y = imageData.height;
        while (y--) {
            checkPixel({x: focusPixel.x, y: y});
        }

        var x = imageData.width;
        while (x--) {
            checkPixel({x: x, y: focusPixel.y});
        }

        // Move the return one pixel further along the path
        maximum.x = maximum.x+-1*sign(maximum.x, focusPixel.x)+snapWindow.firstPixel.x;
        maximum.y = maximum.y+-1*sign(maximum.y, focusPixel.y)+snapWindow.firstPixel.y;

        return maximum;
    },
    getSnapToTarget: function(edgeContext, coordStart, coordEnd, scanRange) {
        // Load the window we are concerned with right now
        var snapWindow = ImageDataUtils.getWindow(edgeContext, coordEnd, scanRange || DEFAULT_SNAP_SCAN_RANGE),
            imageData = snapWindow.imageData,
            data = imageData.data,
            endOffset = ImageDataUtils.getOffset(snapWindow.focusPixel, imageData),

            angle = LineUtils.slopeInRads(coordStart, coordEnd),
            shiftedStart = {x: coordStart.x-snapWindow.firstPixel.x, y: coordStart.y-snapWindow.firstPixel.y};

        var maximum = snapWindow.focusPixel;
        maximum.slopeDelta = 0;
        maximum.distance = LineUtils.distance(shiftedStart, maximum);
        maximum.delta = 0;

        // Scan the window for any pixels that are dratically different
        var y = imageData.height;
        while (y--) {
            var x = imageData.width;
            while (x--) {
                var coord = {x: x, y: y},
                    delta = getPixelDelta(coord, endOffset, imageData);

                if (delta > 128) {
                    coord.distance = LineUtils.distance(shiftedStart, coord);
                    coord.delta = delta;
                    coord.slopeDelta = Math.abs(LineUtils.slopeInRads(shiftedStart, coord)-angle);
                    if ((maximum.slopeDelta-coord.slopeDelta || coord.delta-maximum.delta || coord.distance-maximum.distance) > 0) {
                        maximum = coord;
                    }
                }
            }
        }

        maximum.x += snapWindow.firstPixel.x;
        maximum.y += snapWindow.firstPixel.y;

        return maximum;
    },
    getEdgeContext: function(el) {
        var loadOptions = {};
        Pixastic.process(ImageDataUtils.cloneCanvas(el), "edges", loadOptions);
        return loadOptions.resultCanvas.getContext("2d");
    },
    cloneCanvas: function(el) {
        var clone = document.createElement("canvas");
        clone.width = el.naturalWidth || el.width;
        clone.height = el.naturalHeight || el.height;
        clone.getContext("2d").drawImage(el, 0, 0);
        return clone;
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
