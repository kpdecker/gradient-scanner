/*
 * Copyright (c) 2011 Kevin Decker (http://www.incaseofstairs.com/)
 * See LICENSE for license information
 */
/*global $, ColorStops, LineUtils */

// Global namespace
var GradientScanner = {};

$(document).ready(function() {
    var linePreview = $(".line-preview");

    // Provide a 1px transparent image for the preview images
    linePreview.attr("src", "data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACwAAAAAAQABAAACAkQBADs=");

    var line, gradientType = "linear";

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

        ColorStops.applyBackground($(".preview-cell"), gradientType, relStart, relEnd, GradientScanner.colorStops);
    }

    $(document).bind("gradientUpdated", function(event) {
        line = GradientScanner.line;

        var css = ColorStops.generateCSS(gradientType, line.start, line.end, GradientScanner.colorStops);
        $("#generatedCss")[0].textContent = "background-image: " + css.join(";\nbackground-image: ");

        updatePreview();
    });
});
