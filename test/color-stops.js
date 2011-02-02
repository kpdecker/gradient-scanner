/*
 * Copyright (c) 2011 Kevin Decker (http://www.incaseofstairs.com/)
 * See LICENSE for license information
 */
$(document).ready(function(){
    module("ColorStops");

    test("getColorValue", function() {
        expect(9);
        equal(ColorStops.getColorValue([255, 0, 0, 255]), "rgb(255, 0, 0)", "getColorValue(255, 0, 0, 255)");
        equal(ColorStops.getColorValue([0, 255, 0, 255]), "rgb(0, 255, 0)", "getColorValue(0, 255, 0, 255)");
        equal(ColorStops.getColorValue([0, 0, 255, 255]), "rgb(0, 0, 255)", "getColorValue(0, 0, 255, 255)");
        equal(ColorStops.getColorValue([0, 0, 0, 255]), "rgb(0, 0, 0)", "getColorValue(0, 0, 0, 255)");

        equal(ColorStops.getColorValue([255, 0, 0, 0]), "rgba(255, 0, 0, 0)", "getColorValue(255, 0, 0, 0)");
        equal(ColorStops.getColorValue([0, 255, 0, 0]), "rgba(0, 255, 0, 0)", "getColorValue(0, 255, 0, 0)");
        equal(ColorStops.getColorValue([0, 0, 255, 0]), "rgba(0, 0, 255, 0)", "getColorValue(0, 0, 255, 0)");
        equal(ColorStops.getColorValue([0, 0, 0, 0]), "rgba(0, 0, 0, 0)", "getColorValue(0, 0, 0, 0)");

        equal(ColorStops.getColorValue([128.5, 128.5, 128.5, 128.5]), "rgba(128, 128, 128, 128)", "getColorValue(128.5, 128.5, 128.5, 128.5)");
    });

    test("generateCSS", function() {
        expect(7);
        var redToBlue = [
                {position: 0, color: [255, 0, 0, 255]},
                {position: 0.5, color: [255, 0, 255, 255], disabled: true},
                {position: 1, color: [0, 0, 255, 255]}
            ],
            steppedRedToBlue = [
                {position: 0.25, color: [255, 0, 0, 255]},
                {position: 0.5, color: [255, 0, 255, 255], disabled: true},
                {position: 0.75, color: [0, 0, 255, 255]}
            ];

        // Colorstop Generation Tests
        deepEqual(ColorStops.generateCSS("linear", {x:0, y:0}, {x:0, y:"100%"}, redToBlue), [
            "-webkit-gradient(linear, 0 0, 0 100%, from(rgb(255, 0, 0)), to(rgb(0, 0, 255)))",
            "-moz-linear-gradient(rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)"
        ], "generateCSS(linear, {0,0}, {0,100%}, redToBlue)");

        deepEqual(ColorStops.generateCSS("linear", {x:0, y:0}, {x:0, y:"100%"}, steppedRedToBlue), [
            "-webkit-gradient(linear, 0 0, 0 100%, color-stop(0.25, rgb(255, 0, 0)), color-stop(0.75, rgb(0, 0, 255)))",
            "-moz-linear-gradient(rgb(255, 0, 0) 25%, rgb(0, 0, 255) 75%)"
        ], "generateCSS(linear, {0,0}, {0,100%}, steppedRedToBlue)");

        // Position and angle Tests
        deepEqual(ColorStops.generateCSS("linear", {x:0, y:"100%"}, {x:0, y:0}, redToBlue), [
            "-webkit-gradient(linear, 0 100%, 0 0, from(rgb(255, 0, 0)), to(rgb(0, 0, 255)))",
            "-moz-linear-gradient(0 100% 90deg, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)"
        ], "generateCSS(linear, {0,100%}, {0,0}, redToBlue)");

        deepEqual(ColorStops.generateCSS("linear", {x:0, y:0}, {x:"100%", y:0}, redToBlue), [
            "-webkit-gradient(linear, 0 0, 100% 0, from(rgb(255, 0, 0)), to(rgb(0, 0, 255)))",
            "-moz-linear-gradient(360deg, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)"
        ], "generateCSS(linear, {0,0}, {100%, 0}, redToBlue)");
        deepEqual(ColorStops.generateCSS("linear", {x:"100%", y:0}, {x:0, y:0}, redToBlue), [
            "-webkit-gradient(linear, 100% 0, 0 0, from(rgb(255, 0, 0)), to(rgb(0, 0, 255)))",
            "-moz-linear-gradient(100% 0 180deg, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)"
        ], "generateCSS(linear, {100%,0}, {0, 0}, redToBlue)");

        deepEqual(ColorStops.generateCSS("linear", {x:0, y:0}, {x:"100%", y:"100%"}, redToBlue), [
            "-webkit-gradient(linear, 0 0, 100% 100%, from(rgb(255, 0, 0)), to(rgb(0, 0, 255)))",
            "-moz-linear-gradient(315deg, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)"
        ], "generateCSS(linear, {0,0}, {100%, 100%}, redToBlue)");
        deepEqual(ColorStops.generateCSS("linear", {x:"100%", y:"100%"}, {x:0, y:0}, redToBlue), [
            "-webkit-gradient(linear, 100% 100%, 0 0, from(rgb(255, 0, 0)), to(rgb(0, 0, 255)))",
            "-moz-linear-gradient(100% 100% 135deg, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)"
        ], "generateCSS(linear, {100%, 100%}, {0,0}, redToBlue)");
    });
});
