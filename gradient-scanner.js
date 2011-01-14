/*
 * Copyright (c) 2011 Kevin Decker (http://www.incaseofstairs.com/)
 * See LICENSE for license information
 */
$(document).ready(function() {
    const SNAP_TO_PX = 10;

    var canvas = $("#imageDisplay"),
        canvasOffset = canvas.offset(),
        context = canvas[0].getContext("2d"),

        linePreview = document.getElementById("linePreview"),
        colorStopsEl = $("#colorStops");

    $.template("colorStopTemplate", "<div class=\"colorStop\"> <div class=\"colorPreview\" style=\"background-color: ${colorCss}\"/>${position} ${colorCss}</div>");

    var dragStart, dragEnd, imageData, colorStops, edgeContext;

    // TODO : Replace this with an actual loader once we are at that point
    $("#edgeDebug").load(function() {
        var loadOptions = {};
        $(this).pixastic("edges", loadOptions);
        edgeContext = loadOptions.resultCanvas.getContext("2d");
    });

    canvas.parent().mousedown(function(event) {
        dragStart = {x: event.pageX-canvasOffset.left, y: event.pageY-canvasOffset.top};

        var edgeSnaps = ImageDataUtils.getInitialSnapToTarget(edgeContext, dragStart);
        dragStart = edgeSnaps || dragStart;
        // Init the line overlay
        $("#lineOverlay").css("width", "0px")
                .css("left", dragStart.x+"px")
                .css("top", dragStart.y+"px");

        colorStopsEl.html("");

        event.preventDefault();
    }).mousemove(function(event) {
        if (dragStart) {
            dragEnd = {x: event.pageX-canvasOffset.left, y: event.pageY-canvasOffset.top};

            // Check for snapto
            if (Math.abs(dragEnd.y-dragStart.y) < SNAP_TO_PX) {
                dragEnd.y = dragStart.y;
            } else if (Math.abs(dragEnd.x-dragStart.x) < SNAP_TO_PX) {
                dragEnd.x = dragStart.x;
            }

            // Check for edge snapto
            var edgeSnap = ImageDataUtils.getSnapToTarget(edgeContext, dragStart, dragEnd);
            dragEnd = edgeSnap || dragEnd;

            // Output debug info. To be removed after the UI is worked out
            $("#lineInfo").text(""
                + " dragStart: " + JSON.stringify(dragStart)
                + " dragEnd: " + JSON.stringify(dragEnd)
                + " deltaX: " + (dragEnd.x-dragStart.x)
                + " deltaY: "+ (dragEnd.y-dragStart.y)
                + " m: " + (dragEnd.y-dragStart.y)/(dragEnd.x-dragStart.x)
            );

            // Collect the line data while the user is dragging
            imageData = ImageDataUtils.getLinePixels(context, dragStart, dragEnd);
            if (!imageData) {
                return;
            }

            // Display the line preview
            var stretcher = ImageDataUtils.createCanvasFromImageData(imageData);
            linePreview.src = stretcher.toDataURL();

            // Move the line indicator
            var slopeRads = LineUtils.slopeInRads(dragStart, dragEnd),
                distance = LineUtils.distance(dragStart, dragEnd),
                rotate = "rotate(" + LineUtils.slopeInRads(dragStart, dragEnd) + "rad)";
            $("#lineOverlay").css("width", distance)
                    .css("-moz-transform", rotate)
                    .css("-o-transform", rotate)
                    .css("-webkit-transform", rotate);
        }
    }).mouseup(function(event) {
        colorStops = ColorStops.extractColorStops(imageData.data);

        colorStops.forEach(function(stop, index) {
            var stopEl = $.tmpl("colorStopTemplate", {
                position: stop.position,
                colorCss: "RGBA(" + stop.color.join(", ") + ")"
            });
            stopEl.data("stopIndex", index);
            colorStopsEl.append(stopEl);
        });
        $("#stopCount").text("Count: " + colorStops.length);

        $("#gradientPreview").css("background-image", ColorStops.generateCSS(colorStops));

        dragStart = undefined;
    });
    colorStopsEl.delegate(".colorStop", "click", function(event) {
        var el = $(this);
        colorStops[el.data("stopIndex")].disabled = el.toggleClass("disabled").hasClass("disabled");

        $("#gradientPreview").css("background-image", ColorStops.generateCSS(colorStops));
    });
});
