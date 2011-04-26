/*
 * Copyright (c) 2011 Kevin Decker (http://www.incaseofstairs.com/)
 * See LICENSE for license information
 */
/*global $, jQuery, ColorStops, GradientScanner */

$(document).ready(function() {
    var colorStops, deltaE = ColorStops.JND;

    function outputGradient() {
        ColorStops.applyBackground($(".gradient-preview"), "linear", {x: 0, y: 0}, {x: "100%", y: 0}, colorStops);
        $(".stop-count").text("Count: " + colorStops.filter(function(stop) { return !stop.disabled; }).length + " deltaE: " + deltaE);
    }
    function updateGradient() {
        GradientScanner.colorStops = colorStops = ColorStops.extractColorStops(GradientScanner.line.imageData.data, deltaE);

        $(document).trigger(new jQuery.Event("deltaEUpdated"));
    }

    $(".delta-e-slider").slider({
        value: deltaE,
        step: 0.5,
        min: 1,
        max: 15,
        slide: function(event, ui) {
            deltaE = ui.value;

            updateGradient();
        }
    });

    $(document).bind("imageLoaded", function(event) {
        $(".gradient-preview").css("background", "none");
        $(".stop-count").text('');
    });
    $(document).bind("lineUpdated", updateGradient);
    $(document).bind("deltaEUpdated", outputGradient);
    $(document).bind("gradientUpdated", outputGradient);
});
