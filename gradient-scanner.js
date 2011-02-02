/*
 * Copyright (c) 2011 Kevin Decker (http://www.incaseofstairs.com/)
 * See LICENSE for license information
 */
var edgeContext;        // Global for now, move to ready scope once the file loader is complete
$(document).ready(function() {
    const SNAP_TO_PX = 10;

    var canvas = $("#imageDisplay"),
        canvasOffset = canvas.offset(),
        context = canvas[0].getContext("2d"),

        linePreview = document.getElementById("linePreview"),
        colorStopsEl = $("#colorStops");

    $.template(
        "colorStopTemplate",
        "<div class=\"color-stop\">"
            + "<div class=\"color-preview\" style=\"background-color: ${colorCss}\"/>"
            + "${colorCss} ${position}"
        + "</div>");

    var dragging, dragStart, dragEnd, relStart, relEnd, imageData, gradientType = "linear", colorStops, deltaE = ColorStops.JND;

    function outputGradient() {
        var css = ColorStops.generateCSS(gradientType, dragStart, dragEnd, colorStops);

        ColorStops.applyBackground($("#gradientPreview"), "linear", {x: 0, y: 0}, {x: "100%", y: 0}, colorStops);
        $("#generatedCss")[0].textContent = "background-image: " + css.join(";\nbackground-image: ");
        $("#stopCount").text("Count: " + colorStops.filter(function(stop) { return !stop.disabled; }).length + " deltaE: " + deltaE);
    }
    function updateGradient() {
        colorStops = ColorStops.extractColorStops(imageData.data, deltaE);

        colorStops.forEach(function(stop, index) {
            var stopEl = $.tmpl("colorStopTemplate", {
                position: stop.position,
                colorCss: ColorStops.getColorValue(stop.color),
            });
            stopEl.data("stopIndex", index);
            colorStopsEl.append(stopEl);
        });

        outputGradient();
    }

    function updatePreview() {
        var containing = LineUtils.containingRect(dragStart, dragEnd, 25);

        $(".preview-cell").css("left", containing.x+"px")
                .css("top", containing.y+"px")
                .css("width", containing.width+"px")
                .css("height", containing.height+"px");

        ColorStops.applyBackground($(".preview-cell"), gradientType, relStart, relEnd, colorStops);
    }

    $(".delta-e-slider").slider({
        value: deltaE,
        step: 0.5,
        min: 1,
        max: 15,
        slide: function(event, ui) {
            deltaE = ui.value;

            colorStopsEl.html("");
            updateGradient();
        }
    });

    canvas.parent().mousedown(function(event) {
        dragging = true;
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
        if (dragging) {
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
            var distance = LineUtils.distance(dragStart, dragEnd),
                rotate = "rotate(" + LineUtils.slopeInRads(dragStart, dragEnd) + "rad)";
            $("#lineOverlay").css("width", distance)
                    .css("-moz-transform", rotate)
                    .css("-o-transform", rotate)
                    .css("-webkit-transform", rotate);
        }
    }).mouseup(function(event) {
        var containing = LineUtils.containingRect(dragStart, dragEnd);

        // Clip the coords to their containing boxes.
        relStart = LineUtils.relativeCoords(dragStart, containing);
        relEnd = LineUtils.relativeCoords(dragEnd, containing);

        dragging = false;

        updateGradient();
        updatePreview();
    });
    colorStopsEl.delegate(".color-stop", "click", function(event) {
        var el = $(this);
        colorStops[el.data("stopIndex")].disabled = el.toggleClass("disabled").hasClass("disabled");

        outputGradient();
    });
});
