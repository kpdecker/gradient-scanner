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
        expect(21);
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
            "-webkit-linear-gradient(rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)",
            "-moz-linear-gradient(rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)"
        ], "generateCSS(linear, {0,0}, {0,100%}, redToBlue)");

        deepEqual(ColorStops.generateCSS("linear", {x:0, y:0}, {x:0, y:"100%"}, steppedRedToBlue), [
            "-webkit-gradient(linear, 0 0, 0 100%, color-stop(0.25, rgb(255, 0, 0)), color-stop(0.75, rgb(0, 0, 255)))",
            "-webkit-linear-gradient(rgb(255, 0, 0) 25%, rgb(0, 0, 255) 75%)",
            "-moz-linear-gradient(rgb(255, 0, 0) 25%, rgb(0, 0, 255) 75%)"
        ], "generateCSS(linear, {0,0}, {0,100%}, steppedRedToBlue)");

        // Position and angle Tests
        deepEqual(ColorStops.generateCSS("linear", {x:0, y:"100%"}, {x:0, y:0}, redToBlue), [
            "-webkit-gradient(linear, 0 100%, 0 0, from(rgb(255, 0, 0)), to(rgb(0, 0, 255)))",
            "-webkit-linear-gradient(90deg, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)",
            "-moz-linear-gradient(90deg, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)"
        ], "generateCSS(linear, {0,100%}, {0,0}, redToBlue)");

        deepEqual(ColorStops.generateCSS("linear", {x:0, y:0}, {x:"100%", y:0}, redToBlue), [
            "-webkit-gradient(linear, 0 0, 100% 0, from(rgb(255, 0, 0)), to(rgb(0, 0, 255)))",
            "-webkit-linear-gradient(360deg, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)",
            "-moz-linear-gradient(360deg, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)"
        ], "generateCSS(linear, {0,0}, {100%, 0}, redToBlue)");
        deepEqual(ColorStops.generateCSS("linear", {x:"100%", y:0}, {x:0, y:0}, redToBlue), [
            "-webkit-gradient(linear, 100% 0, 0 0, from(rgb(255, 0, 0)), to(rgb(0, 0, 255)))",
            "-webkit-linear-gradient(180deg, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)",
            "-moz-linear-gradient(180deg, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)"
        ], "generateCSS(linear, {100%,0}, {0, 0}, redToBlue)");

        deepEqual(ColorStops.generateCSS("linear", {x:0, y:0}, {x:"100%", y:"100%"}, redToBlue), [
            "-webkit-gradient(linear, 0 0, 100% 100%, from(rgb(255, 0, 0)), to(rgb(0, 0, 255)))",
            "-webkit-linear-gradient(315deg, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)",
            "-moz-linear-gradient(315deg, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)"
        ], "generateCSS(linear, {0,0}, {100%, 100%}, redToBlue)");
        deepEqual(ColorStops.generateCSS("linear", {x:"100%", y:"100%"}, {x:0, y:0}, redToBlue), [
            "-webkit-gradient(linear, 100% 100%, 0 0, from(rgb(255, 0, 0)), to(rgb(0, 0, 255)))",
            "-webkit-linear-gradient(135deg, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)",
            "-moz-linear-gradient(135deg, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)"
        ], "generateCSS(linear, {100%, 100%}, {0,0}, redToBlue)");

        // Positions that do not fill the entire region
        deepEqual(ColorStops.generateCSS("linear", {x:0, y:"25%"}, {x:0, y:"50%"}, redToBlue), [
            "-webkit-gradient(linear, 0 25%, 0 50%, from(rgb(255, 0, 0)), to(rgb(0, 0, 255)))",
            "-webkit-linear-gradient(rgb(255, 0, 0) 25%, rgb(0, 0, 255) 50%)",
            "-moz-linear-gradient(rgb(255, 0, 0) 25%, rgb(0, 0, 255) 50%)"
        ], "generateCSS(linear, {0,25%}, {0,50%}, redToBlue)");
        deepEqual(ColorStops.generateCSS("linear", {x:0, y:"50%"}, {x:0, y:"25%"}, redToBlue), [
            "-webkit-gradient(linear, 0 50%, 0 25%, from(rgb(255, 0, 0)), to(rgb(0, 0, 255)))",
            "-webkit-linear-gradient(90deg, rgb(255, 0, 0) 50%, rgb(0, 0, 255) 75%)",
            "-moz-linear-gradient(90deg, rgb(255, 0, 0) 50%, rgb(0, 0, 255) 75%)"
        ], "generateCSS(linear, {0,50%}, {0,25%}, redToBlue)");

        deepEqual(ColorStops.generateCSS("linear", {x:"25%", y:0}, {x:"50%", y:0}, redToBlue), [
            "-webkit-gradient(linear, 25% 0, 50% 0, from(rgb(255, 0, 0)), to(rgb(0, 0, 255)))",
            "-webkit-linear-gradient(360deg, rgb(255, 0, 0) 25%, rgb(0, 0, 255) 50%)",
            "-moz-linear-gradient(360deg, rgb(255, 0, 0) 25%, rgb(0, 0, 255) 50%)"
        ], "generateCSS(linear, {25%,0}, {50%,0}, redToBlue)");
        deepEqual(ColorStops.generateCSS("linear", {x:"50%", y:0}, {x:"25%", y:0}, redToBlue), [
            "-webkit-gradient(linear, 50% 0, 25% 0, from(rgb(255, 0, 0)), to(rgb(0, 0, 255)))",
            "-webkit-linear-gradient(180deg, rgb(255, 0, 0) 50%, rgb(0, 0, 255) 75%)",
            "-moz-linear-gradient(180deg, rgb(255, 0, 0) 50%, rgb(0, 0, 255) 75%)"
        ], "generateCSS(linear, {50%,0}, {25%,0}, redToBlue)");

        deepEqual(ColorStops.generateCSS("linear", {x:"25%", y:"25%"}, {x:"50%", y:"50%"}, redToBlue), [
            "-webkit-gradient(linear, 25% 25%, 50% 50%, from(rgb(255, 0, 0)), to(rgb(0, 0, 255)))",
            "-webkit-linear-gradient(315deg, rgb(255, 0, 0) 25%, rgb(0, 0, 255) 50%)",
            "-moz-linear-gradient(315deg, rgb(255, 0, 0) 25%, rgb(0, 0, 255) 50%)"
        ], "generateCSS(linear, {25%,25%}, {50%,50%}, redToBlue)");
        deepEqual(ColorStops.generateCSS("linear", {x:"50%", y:"50%"}, {x:"25%", y:"25%"}, redToBlue), [
            "-webkit-gradient(linear, 50% 50%, 25% 25%, from(rgb(255, 0, 0)), to(rgb(0, 0, 255)))",
            "-webkit-linear-gradient(135deg, rgb(255, 0, 0) 50%, rgb(0, 0, 255) 75%)",
            "-moz-linear-gradient(135deg, rgb(255, 0, 0) 50%, rgb(0, 0, 255) 75%)"
        ], "generateCSS(linear, {50%,50%}, {25%,25%}, redToBlue)");

        // Shifted offset
        deepEqual(ColorStops.generateCSS("linear", {x:"25%", y:"50%"}, {x:"50%", y:"75%"}, redToBlue), [
            "-webkit-gradient(linear, 25% 50%, 50% 75%, from(rgb(255, 0, 0)), to(rgb(0, 0, 255)))",
            "-webkit-linear-gradient(315deg, rgb(255, 0, 0) 37.5%, rgb(0, 0, 255) 62.5%)",
            "-moz-linear-gradient(315deg, rgb(255, 0, 0) 37.5%, rgb(0, 0, 255) 62.5%)"
        ], "generateCSS(linear, {25%,50%}, {50%,75%}, redToBlue)");

        // Stepped partial
        deepEqual(ColorStops.generateCSS("linear", {x:0, y:"25%"}, {x:0, y:"50%"}, steppedRedToBlue), [
            "-webkit-gradient(linear, 0 25%, 0 50%, color-stop(0.25, rgb(255, 0, 0)), color-stop(0.75, rgb(0, 0, 255)))",
            "-webkit-linear-gradient(rgb(255, 0, 0) 31.2%, rgb(0, 0, 255) 43.7%)",
            "-moz-linear-gradient(rgb(255, 0, 0) 31.2%, rgb(0, 0, 255) 43.7%)"
        ], "generateCSS(linear, {0,25%}, {0,50%}, steppedRedToBlue)");

        // Non-percentage positions
        deepEqual(ColorStops.generateCSS("linear", {x:25, y:0}, {x:50, y:0}, redToBlue), [
            "-webkit-gradient(linear, 25px 0, 50px 0, from(rgb(255, 0, 0)), to(rgb(0, 0, 255)))",
            "-webkit-linear-gradient(360deg, rgb(255, 0, 0) 50%, rgb(0, 0, 255) 100%)",
            "-moz-linear-gradient(360deg, rgb(255, 0, 0) 50%, rgb(0, 0, 255) 100%)"
        ], "generateCSS(linear, {25,0}, {50,0}, redToBlue)");
        deepEqual(ColorStops.generateCSS("linear", {x:0, y:25}, {x:0, y:50}, redToBlue), [
            "-webkit-gradient(linear, 0 25px, 0 50px, from(rgb(255, 0, 0)), to(rgb(0, 0, 255)))",
            "-webkit-linear-gradient(rgb(255, 0, 0) 50%, rgb(0, 0, 255) 100%)",
            "-moz-linear-gradient(rgb(255, 0, 0) 50%, rgb(0, 0, 255) 100%)"
        ], "generateCSS(linear, {0,25}, {0,50}, redToBlue)");
        deepEqual(ColorStops.generateCSS("linear", {x:25, y:25}, {x:50, y:50}, redToBlue), [
            "-webkit-gradient(linear, 25px 25px, 50px 50px, from(rgb(255, 0, 0)), to(rgb(0, 0, 255)))",
            "-webkit-linear-gradient(315deg, rgb(255, 0, 0) 50%, rgb(0, 0, 255) 100%)",
            "-moz-linear-gradient(315deg, rgb(255, 0, 0) 50%, rgb(0, 0, 255) 100%)"
        ], "generateCSS(linear, {25,25}, {50,50}, redToBlue)");
        deepEqual(ColorStops.generateCSS("linear", {x:50, y:50}, {x:25, y:25}, redToBlue), [
            "-webkit-gradient(linear, 50px 50px, 25px 25px, from(rgb(255, 0, 0)), to(rgb(0, 0, 255)))",
            "-webkit-linear-gradient(135deg, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 50%)",
            "-moz-linear-gradient(135deg, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 50%)"
        ], "generateCSS(linear, {50,50}, {25,25}, redToBlue)");
        deepEqual(ColorStops.generateCSS("linear", {x:25, y:25}, {x:50, y:50}, redToBlue, {x:0,y:0, width:100,height:100}), [
            "-webkit-gradient(linear, 25px 25px, 50px 50px, from(rgb(255, 0, 0)), to(rgb(0, 0, 255)))",
            "-webkit-linear-gradient(315deg, rgb(255, 0, 0) 25%, rgb(0, 0, 255) 50%)",
            "-moz-linear-gradient(315deg, rgb(255, 0, 0) 25%, rgb(0, 0, 255) 50%)"
        ], "generateCSS(linear, {25,25}, {50,50}, redToBlue, {0,0,100,100})");
        deepEqual(ColorStops.generateCSS("linear", {x:50, y:50}, {x:25, y:25}, redToBlue, {x:0,y:0, width:100,height:100}), [
            "-webkit-gradient(linear, 50px 50px, 25px 25px, from(rgb(255, 0, 0)), to(rgb(0, 0, 255)))",
            "-webkit-linear-gradient(135deg, rgb(255, 0, 0) 50%, rgb(0, 0, 255) 75%)",
            "-moz-linear-gradient(135deg, rgb(255, 0, 0) 50%, rgb(0, 0, 255) 75%)"
        ], "generateCSS(linear, {50,50}, {25,25}, redToBlue, {0,0,100,100})");
    });
});
