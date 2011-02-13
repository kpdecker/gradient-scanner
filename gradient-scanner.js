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

        linePreview = $(".line-preview"),
        colorStopsEl = $("#colorStops"),
        flowSection = $(".flow-section");

    // Provide a 1px transparent image for the preview images
    linePreview.attr("src", "data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACwAAAAAAQABAAACAkQBADs=");

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
                colorCss: ColorStops.getColorValue(stop.color)
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
        var canvasOffset = canvas.offset();
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
            var canvasOffset = canvas.offset();
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

            // Collect the line data while the user is dragging
            imageData = ImageDataUtils.getLinePixels(context, dragStart, dragEnd);
            if (!imageData) {
                return;
            }

            // Display the line preview
            var stretcher = ImageDataUtils.createCanvasFromImageData(imageData);
            linePreview.attr("src", stretcher.toDataURL());

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

    flowSection.first().addClass("active");
    $(".flow-prev").click(function() {
        var last;
        flowSection.each(function(index) {
            var el = $(this);
            if (el.hasClass("active")) {
                // Hide the current section and display the new one
                el.removeClass("active");
                last.addClass("active");

                // Update the button states
                $(".flow-next").addClass("active");
                if (!index) {
                    $(".flow-prev").removeClass("active");
                } else {
                    $(".flow-prev").addClass("active");
                }

                return false;
            }
            last = el;
        });
    });
    $(".flow-next").addClass("active").click(function() {
        var foundActive;
        flowSection.each(function(index) {
            var el = $(this);
            if (el.hasClass("active")) {
                el.removeClass("active");
                foundActive = true;
            } else if (foundActive) {
                el.addClass("active");

                // Update the button states
                $(".flow-prev").addClass("active");
                if (index === flowSection.length-1) {
                    $(".flow-next").removeClass("active");
                } else {
                    $(".flow-next").addClass("active");
                }

                return false;
            }
        });
    });
});
