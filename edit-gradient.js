/*
 * Copyright (c) 2011 Kevin Decker (http://www.incaseofstairs.com/)
 * See LICENSE for license information
 */
/*global $, jQuery, ColorStops, GradientScanner */

$(document).ready(function() {
    $.template(
        "colorStopTemplate",
        "<div class=\"color-stop\">"
            + "<div class=\"color-preview\" style=\"background-color: ${colorCss}\"/>"
            + "${colorCss} ${position}%"
        + "</div>");

    var colorStopsEl = $("#colorStops");

    var colorStops, deltaE = ColorStops.JND;

    function outputGradient() {
        ColorStops.applyBackground($("#gradientPreview"), "linear", {x: 0, y: 0}, {x: "100%", y: 0}, colorStops);
        $("#stopCount").text("Count: " + colorStops.filter(function(stop) { return !stop.disabled; }).length + " deltaE: " + deltaE);

        $(document).trigger(new jQuery.Event("gradientUpdated"));
    }
    function updateGradient() {
        GradientScanner.colorStops = colorStops = ColorStops.extractColorStops(GradientScanner.line.imageData.data, deltaE);

        colorStops.forEach(function(stop, index) {
            var stopEl = $.tmpl("colorStopTemplate", {
                position: Math.floor(stop.position*1000)/10,
                colorCss: ColorStops.getColorValue(stop.color)
            });
            stopEl.data("stopIndex", index);
            colorStopsEl.append(stopEl);
        });

        outputGradient();
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

    colorStopsEl.delegate(".color-stop", "click", function(event) {
        var el = $(this);
        colorStops[el.data("stopIndex")].disabled = el.toggleClass("disabled").hasClass("disabled");

        outputGradient();
    });

    $(document).bind("lineUpdated", updateGradient);
});
