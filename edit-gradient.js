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

    var colorStops, editStop, deltaE = ColorStops.JND;

    function renderStop(stop, index) {
        var stopEl = $.tmpl("colorStopTemplate", {
            position: Math.floor(stop.position*1000)/10,
            colorCss: ColorStops.getColorValue(stop.color)
        });
        stopEl.data("stopIndex", index);

        return stopEl;
    }
    function outputGradient() {
        ColorStops.applyBackground($("#gradientPreview"), "linear", {x: 0, y: 0}, {x: "100%", y: 0}, colorStops);
        $("#stopCount").text("Count: " + colorStops.filter(function(stop) { return !stop.disabled; }).length + " deltaE: " + deltaE);

        $(document).trigger(new jQuery.Event("gradientUpdated"));
    }
    function updateGradient() {
        colorStopsEl.html("");
        $(".stop-editor").removeClass("active");

        GradientScanner.colorStops = colorStops = ColorStops.extractColorStops(GradientScanner.line.imageData.data, deltaE);

        colorStops.forEach(function(stop, index) {
            colorStopsEl.append(renderStop(stop, index));
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

            updateGradient();
        }
    });

    $(".stop-position-slider").slider({
        step: 0.001,
        min: 0,
        max: 1,
        slide: function(event, ui) {
            var growing = editStop.position < ui.value,

                editingEl = $(".color-stop.editing"),
                curIndex = editingEl.data("stopIndex"),

                toUpdate = colorStopsEl.children().filter(function() {
                    var el = $(this),
                        index = el.data("stopIndex"),
                        stop = colorStops[index];
                    if (growing) {
                        return index > curIndex && stop.position < ui.value;
                    } else {
                        return index < curIndex && stop.position > ui.value;
                    }
                });

            // Update the stop index for all of the elements that are between this location and
            // the destination
            toUpdate.each(function() {
                var el = $(this);
                el.data("stopIndex", el.data("stopIndex") + (growing?-1:1));
            });

            // Update the data model
            curIndex += (growing?1:-1)*toUpdate.length;
            editStop.position = ui.value;
            colorStops.sort(function(a, b) { return a.position-b.position; });

            // Rerender the element for the updated state
            var stopEl = renderStop(editStop, curIndex);
            stopEl.addClass("editing");
            if (!toUpdate.length) {
                editingEl.after(stopEl);
            } else if (growing) {
                toUpdate.last().after(stopEl);
            } else {
                toUpdate.first().before(stopEl);
            }
            editingEl.remove();

            // Make sure that the element is visible
            // TODO : Cache this height value
            colorStopsEl.scrollTop(stopEl.height()*(curIndex-1));

            // Update the rest of the app
            outputGradient();
        }
    });

    colorStopsEl.delegate(".color-stop", "click", function(event) {
        var el = $(this);

        editStop = colorStops[el.data("stopIndex")];

        if (!el.hasClass("editing")) {
            $(".stop-position-slider").slider("option", "value", editStop.position);
            $(".color-sel").css("background-color", ColorStops.getColorValue(editStop.color));

            $(".color-stop.editing").removeClass("editing");
            $(".stop-editor").addClass("active");
        } else {
            $(".stop-editor").removeClass("active");
        }
        el.toggleClass("editing");

        outputGradient();
    });

    $(document).bind("lineUpdated", updateGradient);
});
