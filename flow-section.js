/*
 * Copyright (c) 2011 Kevin Decker (http://www.incaseofstairs.com/)
 * See LICENSE for license information
 */
(function ($) {
    var FlowSection = {
        init: function(options) {
            var flowSection = this;

            this.first().addClass("active");
            $(".flow-prev").click(function() {
                var prev = FlowSection.getPrev.call(flowSection);
                if (prev) {
                    flowSection.filter(".active").removeClass("active");

                    prev.el.addClass("active");

                    // Update the button states
                    $(".flow-next").addClass("active");
                }

                // Update the prev button state
                if (!prev || prev.index <= 0) {
                    $(".flow-prev").removeClass("active");
                } else {
                    $(".flow-prev").addClass("active");
                }
            });
            $(".flow-next").addClass("active").click(function() {
                var next = FlowSection.getNext.call(flowSection);

                if (next) {
                    flowSection.filter(".active").removeClass("active");
                    next.el.addClass("active");

                    // Update the button states
                    $(".flow-prev").addClass("active");
                }

                // Update the next button state
                if (!next || next.index === flowSection.length-1) {
                    $(".flow-next").removeClass("active");
                } else {
                    $(".flow-next").addClass("active");
                }
            });

            return this;
        },

        getPrev: function() {
            var last,
                ret;
            this.each(function(index) {
                var el = $(this);
                if (el.hasClass("active")) {
                    ret = {
                        el: last,
                        index: index-1
                    };

                    return false;
                }
                last = el;
            });

            return ret;
        },
        getNext: function() {
            var foundActive,
                ret;
            this.each(function(index) {
                var el = $(this);
                if (el.hasClass("active")) {
                    foundActive = true;
                } else if (foundActive) {
                    ret = {
                        el: el,
                        index: index
                    };
                    return false;
                }
            });
            return ret;
        },

        enablePrev: function() {
            // Enable the prev button if possible
            var prev = FlowSection.getPrev.call(this);
            if (prev && prev.index > 0) {
                $(".flow-prev").addClass("active");
            }
        },
        enableNext: function() {
            // Enable the next button if possible
            var prev = FlowSection.getNext.call(this);
            if (prev && prev.index < this.length-1) {
                $(".flow-next").addClass("active");
            }
        },
        disable: function(next) {
            // Disable the next/prev button
            $(next ? ".flow-next" : ".flow-prev").removeClass("active");
        }
    }

    $.fn.flowSection = function(method, options) {
        if (method) {
            return FlowSection[method].call(this, options);
        } else {
            return FlowSection.init.call(this, options);
        }
    };
})(jQuery);