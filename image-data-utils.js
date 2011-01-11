/*
 * Copyright (c) 2011 Kevin Decker (http://www.incaseofstairs.com/)
 * See LICENSE for license information
 */
var ImageDataUtils = {
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
    getLinePixels: function(context, coordStart, coordEnd) {
        // Extract the rectangle that contains our data
        var topLeft = {x: Math.min(coordStart.x, coordEnd.x), y: Math.min(coordStart.y, coordEnd.y)},
            bottomRight = {x: Math.max(coordStart.x, coordEnd.x), y: Math.max(coordStart.y, coordEnd.y)},
            dimensions = {width: Math.max(bottomRight.x-topLeft.x, 1), height: Math.max(bottomRight.y-topLeft.y, 1)},

            image = context.getImageData(topLeft.x, topLeft.y, dimensions.width+1, dimensions.height+1),
            imageData = image.data;

        // Determine the properties of our line
        var rise = coordEnd.y-coordStart.y,
            run = coordEnd.x-coordStart.x,
            xIntercept = coordStart.x-topLeft.x,
            yIntercept = coordStart.y-topLeft.y,
            distance = Math.sqrt(Math.pow(rise,2) + Math.pow(run, 2)),

            len = distance|0;
        if (!len) {
            return;
        }

        // Create our destination image
        var line = context.createImageData(len, 1),
            lineData = line.data;

        // Scale the run and rise for each step
        run /= len;
        rise /= len;

        // Walk the parameterized line extracting the pixel content
        for (var t = 0; t < len; t++) {
            // TODO : Examine what sort of interpolation or averaging we want to do if we have a non-integer component
            var coords = {
                x: (run*t + xIntercept) | 0,
                y: (rise*t + yIntercept) | 0
            }
            var offset = ImageDataUtils.getOffset(coords, image);

            var lineOffset = t*4;
            lineData[lineOffset]   = imageData[offset];
            lineData[lineOffset+1] = imageData[offset+1];
            lineData[lineOffset+2] = imageData[offset+2];
            lineData[lineOffset+3] = imageData[offset+3];
        }

        return line;
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
