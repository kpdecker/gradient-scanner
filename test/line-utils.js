/*
 * Copyright (c) 2011 Kevin Decker (http://www.incaseofstairs.com/)
 * See LICENSE for license information
 */
$(document).ready(function(){
    module("LineUtils");

    test("getUnit", function() {
        expect(6);
        equals(LineUtils.getUnit(0), 0, "getUnit(0)");
        equals(LineUtils.getUnit("0px"), 0, "getUnit(0px)");
        equals(LineUtils.getUnit("0%"), 0, "getUnit(0%)");

        equals(LineUtils.getUnit(1), "px", "getUnit(1)");
        equals(LineUtils.getUnit("1px"), "px", "getUnit(1px)");
        equals(LineUtils.getUnit("1%"), "%", "getUnit(1%)");
    });

    test("containingRect", function() {
        expect(26);
        deepEqual(LineUtils.containingRect({x:0, y:0}, {x:0, y:1}), {x:0,y:0, width:1,height:1}, "containingRect({0,0}, {0,1})");
        deepEqual(LineUtils.containingRect({x:0, y:0}, {x:1, y:0}), {x:0,y:0, width:1,height:1}, "containingRect({0,0}, {1,0})");
        deepEqual(LineUtils.containingRect({x:0, y:0}, {x:1, y:1}), {x:0,y:0, width:1,height:1}, "containingRect({0,0}, {1,1})");
        deepEqual(LineUtils.containingRect({x:1, y:1}, {x:0, y:0}), {x:0,y:0, width:1,height:1}, "containingRect({1,1}, {0,0})");
        deepEqual(LineUtils.containingRect({x:1, y:0}, {x:0, y:1}), {x:0,y:0, width:1,height:1}, "containingRect({1,0}, {0,1})");
        deepEqual(LineUtils.containingRect({x:0, y:1}, {x:1, y:0}), {x:0,y:0, width:1,height:1}, "containingRect({0,1}, {1,0})");

        deepEqual(LineUtils.containingRect({x:0, y:0}, {x:0, y:10}, 10), {x:-5,y:0, width:10,height:10}, "containingRect({0,0}, {0,10}, 10)");
        deepEqual(LineUtils.containingRect({x:0, y:0}, {x:10, y:0}, 10), {x:0,y:-5, width:10,height:10}, "containingRect({0,0}, {10,0}, 10)");
        deepEqual(LineUtils.containingRect({x:0, y:0}, {x:10, y:10}, 10), {x:-3,y:-3, width:16,height:16}, "containingRect({0,0}, {10,10}, 10)");
        deepEqual(LineUtils.containingRect({x:10, y:10}, {x:0, y:0}, 10), {x:-3,y:-3, width:16,height:16}, "containingRect({10,10}, {0,0}, 10)");
        deepEqual(LineUtils.containingRect({x:10, y:0}, {x:0, y:10}, 10), {x:-3,y:-3, width:16,height:16}, "containingRect({10,0}, {0,10}, 10)");
        deepEqual(LineUtils.containingRect({x:0, y:10}, {x:10, y:0}, 10), {x:-3,y:-3, width:16,height:16}, "containingRect({0,10}, {10,0}, 10)");

        deepEqual(LineUtils.containingRect({x:0, y:0}, {x:0, y:"1%"}), {x:0,y:0, width:"1%",height:"1%"}, "containingRect({0,0}, {0,1%})");
        deepEqual(LineUtils.containingRect({x:0, y:0}, {x:"1%", y:0}), {x:0,y:0, width:"1%",height:"1%"}, "containingRect({0,0}, {1%,0})");
        deepEqual(LineUtils.containingRect({x:0, y:0}, {x:"1%", y:"1%"}), {x:0,y:0, width:"1%",height:"1%"}, "containingRect({0,0}, {1%,1%})");
        deepEqual(LineUtils.containingRect({x:"1%", y:"1%"}, {x:0, y:0}), {x:0,y:0, width:"1%",height:"1%"}, "containingRect({1%,1%}, {0,0})");
        deepEqual(LineUtils.containingRect({x:"1%", y:0}, {x:0, y:"1%"}), {x:0,y:0, width:"1%",height:"1%"}, "containingRect({1%,0}, {0,1%})");
        deepEqual(LineUtils.containingRect({x:0, y:"1%"}, {x:"1%", y:0}), {x:0,y:0, width:"1%",height:"1%"}, "containingRect({0,1%}, {1%,0})");

        deepEqual(LineUtils.containingRect({x:0, y:0}, {x:0, y:"10%"}, "10%"), {x:"-5%",y:0, width:"10%",height:"10%"}, "containingRect({0,0}, {0,10%}, 10%)");
        deepEqual(LineUtils.containingRect({x:0, y:0}, {x:"10%", y:0}, "10%"), {x:0,y:"-5%", width:"10%",height:"10%"}, "containingRect({0,0}, {10%,0}, 10%)");
        deepEqual(LineUtils.containingRect({x:0, y:0}, {x:"10%", y:"10%"}, "10%"), {x:"-3%",y:"-3%", width:"16%",height:"16%"}, "containingRect({0,0}, {10%,10%}, 10%)");
        deepEqual(LineUtils.containingRect({x:"10%", y:"10%"}, {x:0, y:0}, "10%"), {x:"-3%",y:"-3%", width:"16%",height:"16%"}, "containingRect({10%,10%}, {0,0}, 10%)");
        deepEqual(LineUtils.containingRect({x:"10%", y:0}, {x:0, y:"10%"}, "10%"), {x:"-3%",y:"-3%", width:"16%",height:"16%"}, "containingRect({10%,0}, {0,10%}, 10%)");
        deepEqual(LineUtils.containingRect({x:0, y:"10%"}, {x:"10%", y:0}, "10%"), {x:"-3%",y:"-3%", width:"16%",height:"16%"}, "containingRect({0,10%}, {10%,0}, 10%)");

        deepEqual(LineUtils.containingRect({x:"1%", y:0}, {x:0, y:1}), NaN, "containingRect({1%,0}, {0,1})");
        deepEqual(LineUtils.containingRect({x:"1%", y:0}, {x:0, y:"1%"}, 1), NaN, "containingRect({1%,0}, {0,1%}, 1)");
    });

    test("relativeCoords", function() {
        expect(6);
        deepEqual(LineUtils.relativeCoords({x:0, y:0}, {x:0, y:0}), {x:0,y:0}, "relativeCoords({0,0}, {0,0})");
        deepEqual(LineUtils.relativeCoords({x:0, y:0}, {x:1, y:1}), {x:-1,y:-1}, "relativeCoords({0,0}, {1,1})");
        deepEqual(LineUtils.relativeCoords({x:1, y:1}, {x:0, y:0}), {x:1,y:1}, "relativeCoords({1,1}, {0,0})");

        deepEqual(LineUtils.relativeCoords({x:0, y:0}, {x:"1%", y:"1%"}), {x:"-1%",y:"-1%"}, "relativeCoords({0,0}, {1%,1%})");
        deepEqual(LineUtils.relativeCoords({x:"1%", y:"1%"}, {x:0, y:0}), {x:"1%",y:"1%"}, "relativeCoords({1%,1%}, {0,0})");

        deepEqual(LineUtils.relativeCoords({x:"1%", y:0}, {x:0, y:1}), NaN, "relativeCoords({1%,0}, {0,1})");
    });

    test("distance", function() {
        // Testing conditional logic only, assuming that the math is correct
        expect(13);
        equals(LineUtils.distance({x:0, y:0}, {x:2, y:0}), 2, "distance({0,0}, {2,0})");
        equals(LineUtils.distance({x:2, y:0}, {x:0, y:0}), 2, "distance({2,0}, {0,0})");

        equals(LineUtils.distance({x:0, y:0}, {x:0, y:2}), 2, "distance({0,0}, {0,2})");
        equals(LineUtils.distance({x:0, y:2}, {x:0, y:0}), 2, "distance({0,2}, {0,0})");

        equals(LineUtils.distance({x:0, y:0}, {x:3, y:4}), 5, "distance({0,0}, {3,4})");
        equals(LineUtils.distance({x:3, y:4}, {x:0, y:0}), 5, "distance({3,4}, {0,0})");

        equals(LineUtils.distance({x:0, y:0}, {x:4, y:3}), 5, "distance({0,0}, {4,3})");
        equals(LineUtils.distance({x:4, y:3}, {x:0, y:0}), 5, "distance({4,3}, {0,0})");

        equals(LineUtils.distance({x:0, y:0}, {x:"1%", y:0}), 1, "distance({0,0}, {1%,0})");
        equals(LineUtils.distance({x:"1%", y:0}, {x:0, y:0}), 1, "distance({1%,0}, {0,0})");

        equals(LineUtils.distance({x:0, y:0}, {x:0, y:"1%"}), 1, "distance({0,0}, {0,1%})");
        equals(LineUtils.distance({x:0, y:"1%"}, {x:0, y:0}), 1, "distance({0,1%}, {0,0})");

        deepEqual(LineUtils.distance({x:"1%", y:"1%"}, {x:1, y:0}), NaN, "distance({1%,1%}, {1,0})");
    });

    test("slopeInRads", function() {
        // Testing conditional logic only, assuming that the math is correct
        expect(13);
        equals(LineUtils.slopeInRads({x:0, y:0}, {x:1, y:0}), 0, "slopeInRads({0,0}, {1,0})");
        equals(LineUtils.slopeInRads({x:1, y:0}, {x:0, y:0}), Math.PI, "slopeInRads({1,0}, {0,0})");

        equals(LineUtils.slopeInRads({x:0, y:0}, {x:0, y:1}), Math.PI/2, "slopeInRads({0,0}, {0,1})");
        equals(LineUtils.slopeInRads({x:0, y:1}, {x:0, y:0}), 3*Math.PI/2, "slopeInRads({0,1}, {0,0})");

        equals(LineUtils.slopeInRads({x:0, y:0}, {x:1, y:1}), Math.PI/4, "slopeInRads({0,0}, {1,1})");
        equals(LineUtils.slopeInRads({x:1, y:1}, {x:0, y:0}), 5*Math.PI/4, "slopeInRads({1,1}, {0,0})");

        equals(LineUtils.slopeInRads({x:0, y:0}, {x:"1%", y:0}), 0, "slopeInRads({0,0}, {1%,0})");
        equals(LineUtils.slopeInRads({x:"1%", y:0}, {x:0, y:0}), Math.PI, "slopeInRads({1%,0}, {0,0})");

        equals(LineUtils.slopeInRads({x:0, y:0}, {x:0, y:"1%"}), Math.PI/2, "slopeInRads({0,0}, {0,1%})");
        equals(LineUtils.slopeInRads({x:0, y:"1%"}, {x:0, y:0}), 3*Math.PI/2, "slopeInRads({0,1%}, {0,0})");

        equals(LineUtils.slopeInRads({x:0, y:0}, {x:"1%", y:"1%"}), Math.PI/4, "slopeInRads({0,0}, {1%,1%})");
        equals(LineUtils.slopeInRads({x:"1%", y:"1%"}, {x:0, y:0}), 5*Math.PI/4, "slopeInRads({1%,1%}, {0,0})");

        deepEqual(LineUtils.slopeInRads({x:"1%", y:"1%"}, {x:1, y:0}), NaN, "slopeInRads({1%,1%}, {1,0})");
    });
});
