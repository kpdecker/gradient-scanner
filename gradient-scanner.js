/*
 * Copyright (c) 2011 Kevin Decker (http://www.incaseofstairs.com/)
 * See LICENSE for license information
 */
$(document).ready(function() {
    var canvas = $("#imageDisplay"),
        canvasOffset = canvas.offset(),
        context = canvas[0].getContext("2d"),

        linePreview = document.getElementById("linePreview"),
        colorStopsEl = $("#colorStops");

    $.template("colorStopTemplate", "<div class=\"colorStop\"> <div class=\"colorPreview\" style=\"background-color: ${colorCss}\"/>${position} ${colorCss}</div>");

    var dragStart, dragEnd, imageData;

    canvas.parent().mousedown(function(event) {
        dragStart = {x: event.pageX-canvasOffset.left, y: event.pageY-canvasOffset.top};

        // Init the line overlay
        $("#lineOverlay").css("width", "0px")
                .css("left", dragStart.x+"px")
                .css("top", dragStart.y+"px");

        colorStopsEl.html("");
    }).mousemove(function(event) {
        if (dragStart) {
            dragEnd = {x: event.pageX-canvasOffset.left, y: event.pageY-canvasOffset.top};

            // Output debug info. To be removed after the UI is worked out
            $("#lineInfo").text("dragStart: " + JSON.stringify(dragStart) + " dragEnd: " + JSON.stringify(dragEnd) + " deltaX: " + (dragEnd.x-dragStart.x) + " deltaY: "+ (dragEnd.y-dragStart.y) + " m: " + (dragEnd.y-dragStart.y)/(dragEnd.x-dragStart.x) + " angle: " + LineUtils.slopeInRads(dragStart, dragEnd));

            // Collect the line data while the user is dragging
            imageData = ImageDataUtils.getLinePixels(context, dragStart, dragEnd);

            // Display the line preview
            var stretcher = ImageDataUtils.createCanvasFromImageData(imageData);
            linePreview.src = stretcher.toDataURL();

            // Move the line indicator
            var slopeRads = LineUtils.slopeInRads(dragStart, dragEnd),
                distance = LineUtils.distance(dragStart, dragEnd);
            $("#lineOverlay").css("width", distance)
                    .css("-webkit-transform", "rotate(" + LineUtils.slopeInRads(dragStart, dragEnd) + "rad)");
        }
    }).mouseup(function(event) {
        var colorStops = ColorStops.extractColorStops(imageData.data);

        colorStops.forEach(function(stop) {
            var stopEl = $.tmpl("colorStopTemplate", {
                position: stop.position,
                colorCss: "RGBA(" + stop.color.join(", ") + ")"
            });
            colorStopsEl.append(stopEl);
        });

        $("#gradientPreview").css("background-image", ColorStops.generateCSS(colorStops));

        dragStart = undefined;
    });
});
