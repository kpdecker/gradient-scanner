/*
 * Copyright (c) 2011 Kevin Decker (http://www.incaseofstairs.com/)
 * See LICENSE for license information
 */
var ImageDataUtils;

(function() {
const DEFAULT_SNAP_SCAN_RANGE = 5;

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
