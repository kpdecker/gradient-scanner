/*
 * Copyright (c) 2011 Kevin Decker (http://www.incaseofstairs.com/)
 * See LICENSE for license information
 */
$(document).ready(function() {
    var flowSection = $(".flow-section");

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
                if (index === 1) {
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
