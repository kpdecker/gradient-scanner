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

});
