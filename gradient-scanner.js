/*
 * Copyright (c) 2011 Kevin Decker (http://www.incaseofstairs.com/)
 * See LICENSE for license information
 */
$(document).ready(function() {
    var canvas = document.getElementById("imageDisplay"),
        linePreview = document.getElementById("linePreview"),
        context = canvas.getContext("2d");

    var dragStart, dragEnd;
    $(canvas).mousedown(function(event) {
        dragStart = {x: event.offsetX, y: event.offsetY};

        //$(this).mousemove(event);
    }).mousemove(function(event) {
        if (dragStart) {
            dragEnd = {x: event.offsetX, y: event.offsetY};

            var imageData = ImageDataUtils.getLinePixels(context, dragStart, dragEnd),
                stretcher = ImageDataUtils.createCanvasFromImageData(imageData);

            linePreview.src = stretcher.toDataURL();
        }
    }).mouseup(function(event) {
        dragStart = undefined;
    });
});