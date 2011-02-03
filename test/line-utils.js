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

    test("lineIntercepts", function() {
        expect(27);

        deepEqual(LineUtils.lineIntercepts({x:0, y:0}, {x:0, y:1}, {x:0,y:0, width:1,height:1}), [{x:0, y:0}, {x:0, y:1}], "lineIntercepts({0,0}, {0,1}, {0,0,1,1})");
        deepEqual(LineUtils.lineIntercepts({x:0, y:0}, {x:1, y:0}, {x:0,y:0, width:1,height:1}), [{x:0, y:0}, {x:1, y:0}], "lineIntercepts({0,0}, {1,0}, {0,0,1,1})");
        deepEqual(LineUtils.lineIntercepts({x:0, y:0}, {x:1, y:1}, {x:0,y:0, width:1,height:1}), [{x:0, y:0}, {x:1, y:1}], "lineIntercepts({0,0}, {1,1}, {0,0,1,1})");
        deepEqual(LineUtils.lineIntercepts({x:1, y:1}, {x:0, y:0}, {x:0,y:0, width:1,height:1}), [{x:1, y:1}, {x:0, y:0}], "lineIntercepts({1,1}, {0,0}, {0,0,1,1})");
        deepEqual(LineUtils.lineIntercepts({x:1, y:0}, {x:0, y:1}, {x:0,y:0, width:1,height:1}), [{x:1, y:0}, {x:0, y:1}], "lineIntercepts({1,0}, {0,1}, {0,0,1,1})");
        deepEqual(LineUtils.lineIntercepts({x:0, y:1}, {x:1, y:0}, {x:0,y:0, width:1,height:1}), [{x:0, y:1}, {x:1, y:0}], "lineIntercepts({0,1}, {1,0}, {0,0,1,1})");

        // No intercepts
        deepEqual(LineUtils.lineIntercepts({x:0, y:10}, {x:10, y:10}, {x:0,y:0, width:1,height:1}), [], "lineIntercepts({0,10}, {10,10}, {0,0,1,1})");
        deepEqual(LineUtils.lineIntercepts({x:10, y:0}, {x:10, y:10}, {x:0,y:0, width:1,height:1}), [], "lineIntercepts({10,0}, {10,10}, {0,0,1,1})");

        // Not connected to the edge cases
        deepEqual(LineUtils.lineIntercepts({x:1, y:2}, {x:2, y:3}, {x:0,y:0, width:10,height:10}), [{x:0, y:1}, {x:9, y:10}], "lineIntercepts({1,2}, {2,3}, {0,0,10,10})");
        deepEqual(LineUtils.lineIntercepts({x:2, y:3}, {x:1, y:2}, {x:0,y:0, width:10,height:10}), [{x:9, y:10}, {x:0, y:1}], "lineIntercepts({2,3}, {1,2}, {0,0,10,10})");

        deepEqual(LineUtils.lineIntercepts({x:9, y:1}, {x:8, y:2}, {x:0,y:0, width:10,height:10}), [{x:10, y:0}, {x:0, y:10}], "lineIntercepts({9,1}, {8,2}, {0,0,10,10})");
        deepEqual(LineUtils.lineIntercepts({x:8, y:2}, {x:9, y:1}, {x:0,y:0, width:10,height:10}), [{x:0, y:10}, {x:10, y:0}], "lineIntercepts({2,8}, {9,1}, {0,0,10,10})");

        deepEqual(LineUtils.lineIntercepts({x:9, y:1}, {x:8, y:2}, {x:-1,y:-1, width:11,height:11}), [{x:10, y:0}, {x:0, y:10}], "lineIntercepts({9,1}, {8,2}, {-1,-1,11,11})");
        deepEqual(LineUtils.lineIntercepts({x:8, y:2}, {x:9, y:1}, {x:-1,y:-1, width:11,height:11}), [{x:0, y:10}, {x:10, y:0}], "lineIntercepts({2,8}, {9,1}, {-1,-1,11,11})");

        // Ray mode
        deepEqual(LineUtils.lineIntercepts({x:0, y:0}, {x:0, y:1}, {x:0,y:0, width:1,height:1}, true), [{x:0, y:0}, {x:0, y:1}], "lineIntercepts({0,0}, {0,1}, {0,0,1,1}, true)");
        deepEqual(LineUtils.lineIntercepts({x:0, y:0}, {x:1, y:0}, {x:0,y:0, width:1,height:1}, true), [{x:0, y:0}, {x:1, y:0}], "lineIntercepts({0,0}, {1,0}, {0,0,1,1}, true)");
        deepEqual(LineUtils.lineIntercepts({x:0, y:0}, {x:1, y:1}, {x:0,y:0, width:1,height:1}, true), [{x:0, y:0}, {x:1, y:1}], "lineIntercepts({0,0}, {1,1}, {0,0,1,1}, true)");
        deepEqual(LineUtils.lineIntercepts({x:1, y:1}, {x:0, y:0}, {x:0,y:0, width:1,height:1}, true), [{x:1, y:1}, {x:0, y:0}], "lineIntercepts({1,1}, {0,0}, {0,0,1,1}, true)");
        deepEqual(LineUtils.lineIntercepts({x:1, y:0}, {x:0, y:1}, {x:0,y:0, width:1,height:1}, true), [{x:1, y:0}, {x:0, y:1}], "lineIntercepts({1,0}, {0,1}, {0,0,1,1}, true)");
        deepEqual(LineUtils.lineIntercepts({x:0, y:1}, {x:1, y:0}, {x:0,y:0, width:1,height:1}, true), [{x:0, y:1}, {x:1, y:0}], "lineIntercepts({0,1}, {1,0}, {0,0,1,1}, true)");

        deepEqual(LineUtils.lineIntercepts({x:1, y:2}, {x:2, y:3}, {x:0,y:0, width:10,height:10}, true), [{x:9, y:10}], "lineIntercepts({1,2}, {2,3}, {0,0,10,10}, true)");
        deepEqual(LineUtils.lineIntercepts({x:2, y:3}, {x:1, y:2}, {x:0,y:0, width:10,height:10}, true), [{x:0, y:1}], "lineIntercepts({2,3}, {1,2}, {0,0,10,10}, true)");

        deepEqual(LineUtils.lineIntercepts({x:9, y:1}, {x:8, y:2}, {x:0,y:0, width:10,height:10}, true), [{x:0, y:10}], "lineIntercepts({9,1}, {8,2}, {0,0,10,10}, true)");
        deepEqual(LineUtils.lineIntercepts({x:8, y:2}, {x:9, y:1}, {x:0,y:0, width:10,height:10}, true), [{x:10, y:0}], "lineIntercepts({2,8}, {9,1}, {0,0,10,10}, true)");

        // Units
        deepEqual(LineUtils.lineIntercepts({x:0, y:0}, {x:0, y:"1%"}, {x:0,y:0, width:"1%",height:"1%"}), [{x:0, y:0}, {x:0, y:"1%"}], "lineIntercepts({0,0}, {0,1%}, {0,0,1%,1%})");
        deepEqual(LineUtils.lineIntercepts({x:0, y:0}, {x:"1%", y:"1%"}, {x:0,y:0, width:"1%",height:"1%"}), [{x:0, y:0}, {x:"1%", y:"1%"}], "lineIntercepts({0,0}, {1%,1%}, {0,0,1%,1%})");
        deepEqual(LineUtils.lineIntercepts({x:0, y:0}, {x:0, y:"1%"}, {x:0,y:0, width:1,height:1}), NaN, "lineIntercepts({0,0}, {0,1%}, {0,0,1,1})");
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
