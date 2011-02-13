/*
 * Copyright (c) 2011 Kevin Decker (http://www.incaseofstairs.com/)
 * See LICENSE for license information
 */
/*global $, ColorStops, LineUtils */

// Global namespace
var GradientScanner = {};

$(document).ready(function() {
    var linePreview = $(".line-preview"),
        colorStopsEl = $("#colorStops");

    // Provide a 1px transparent image for the preview images
    linePreview.attr("src", "data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACwAAAAAAQABAAACAkQBADs=");

    $.template(
        "colorStopTemplate",
        "<div class=\"color-stop\">"
            + "<div class=\"color-preview\" style=\"background-color: ${colorCss}\"/>"
            + "${colorCss} ${position}"
        + "</div>");

    var line, gradientType = "linear", colorStops, deltaE = ColorStops.JND;

    function outputGradient() {
        var css = ColorStops.generateCSS(gradientType, line.start, line.end, colorStops);

        ColorStops.applyBackground($("#gradientPreview"), "linear", {x: 0, y: 0}, {x: "100%", y: 0}, colorStops);
        $("#generatedCss")[0].textContent = "background-image: " + css.join(";\nbackground-image: ");
        $("#stopCount").text("Count: " + colorStops.filter(function(stop) { return !stop.disabled; }).length + " deltaE: " + deltaE);
    }
    function updateGradient() {
        colorStops = ColorStops.extractColorStops(line.imageData.data, deltaE);

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
        var containing = LineUtils.containingRect(line.start, line.end, 25),
            relContaining = LineUtils.containingRect(line.start, line.end),

            // Clip the coords to their containing boxes.
            relStart = LineUtils.relativeCoords(line.start, relContaining),
            relEnd = LineUtils.relativeCoords(line.end, relContaining);

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

    $(document).bind("lineUpdated", function(event) {
        line = GradientScanner.line;

        updateGradient();
        updatePreview();
    });
    colorStopsEl.delegate(".color-stop", "click", function(event) {
        var el = $(this);
        colorStops[el.data("stopIndex")].disabled = el.toggleClass("disabled").hasClass("disabled");

        outputGradient();
    });
});
