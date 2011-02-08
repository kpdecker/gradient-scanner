/*
 * Copyright (c) 2011 Kevin Decker (http://www.incaseofstairs.com/)
 * See LICENSE for license information
 */
$(document).ready(function(){
    module("LineUtils");

    test("getUnit", function() {
        expect(16);
        equals(LineUtils.getUnit(0), 0, "getUnit(0)");
        equals(LineUtils.getUnit("0"), 0, "getUnit('0')");
        equals(LineUtils.getUnit("0px"), 0, "getUnit(0px)");
        equals(LineUtils.getUnit("0%"), 0, "getUnit(0%)");

        equals(LineUtils.getUnit(1), "px", "getUnit(1)");
        equals(LineUtils.getUnit("1"), "px", "getUnit('1')");
        equals(LineUtils.getUnit("1px"), "px", "getUnit(1px)");
        equals(LineUtils.getUnit("1%"), "%", "getUnit(1%)");

        equals(LineUtils.getUnit(0.5), "px", "getUnit(0.5)");
        equals(LineUtils.getUnit("0.5"), "px", "getUnit('0.5')");
        equals(LineUtils.getUnit("0.5px"), "px", "getUnit(0.5px)");
        equals(LineUtils.getUnit("0.5%"), "%", "getUnit(0.5%)");

        equals(LineUtils.getUnit(1.5), "px", "getUnit(1.5)");
        equals(LineUtils.getUnit("1.5"), "px", "getUnit('1.5')");
        equals(LineUtils.getUnit("1.5px"), "px", "getUnit(1.5px)");
        equals(LineUtils.getUnit("1.5%"), "%", "getUnit(1.5%)");
    });

    test("containingRect", function() {
        expect(27);
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

        deepEqual(LineUtils.containingRect({x:0, y:0}, {x:0, y:1.5}), {x:0,y:0, width:1,height:1.5}, "containingRect({0,0}, {0,1.5})");

        deepEqual(LineUtils.containingRect({x:"1%", y:0}, {x:0, y:1}), NaN, "containingRect({1%,0}, {0,1})");
        deepEqual(LineUtils.containingRect({x:"1%", y:0}, {x:0, y:"1%"}, 1), NaN, "containingRect({1%,0}, {0,1%}, 1)");
    });

    test("relativeCoords", function() {
        expect(7);
        deepEqual(LineUtils.relativeCoords({x:0, y:0}, {x:0, y:0}), {x:0,y:0}, "relativeCoords({0,0}, {0,0})");
        deepEqual(LineUtils.relativeCoords({x:0, y:0}, {x:1, y:1}), {x:-1,y:-1}, "relativeCoords({0,0}, {1,1})");
        deepEqual(LineUtils.relativeCoords({x:1, y:1}, {x:0, y:0}), {x:1,y:1}, "relativeCoords({1,1}, {0,0})");

        deepEqual(LineUtils.relativeCoords({x:1, y:1}, {x:0.5, y:0.5}), {x:0.5,y:0.5}, "relativeCoords({1,1}, {0.5,0.5})");

        deepEqual(LineUtils.relativeCoords({x:0, y:0}, {x:"1%", y:"1%"}), {x:"-1%",y:"-1%"}, "relativeCoords({0,0}, {1%,1%})");
        deepEqual(LineUtils.relativeCoords({x:"1%", y:"1%"}, {x:0, y:0}), {x:"1%",y:"1%"}, "relativeCoords({1%,1%}, {0,0})");

        deepEqual(LineUtils.relativeCoords({x:"1%", y:0}, {x:0, y:1}), NaN, "relativeCoords({1%,0}, {0,1})");
    });

    test("distance", function() {
        // Testing conditional logic only, assuming that the math is correct
        expect(14);
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

        equals(LineUtils.distance({x:0, y:2.5}, {x:0, y:0}), 2.5, "distance({0,2.5}, {0,0})");

        deepEqual(LineUtils.distance({x:"1%", y:"1%"}, {x:1, y:0}), NaN, "distance({1%,1%}, {1,0})");
    });

    test("percentageOfRay", function() {
        expect(17);

        equals(LineUtils.percentageOfRay({x:0, y:0}, {x:0, y:1}, {x:0,y:0, width:1,height:1}), 1, "percentageOfRay({0,0}, {0,1}, {0,0,1,1})");
        equals(LineUtils.percentageOfRay({x:0, y:0}, {x:1, y:0}, {x:0,y:0, width:1,height:1}), 1, "percentageOfRay({0,0}, {1,0}, {0,0,1,1})");
        equals(LineUtils.percentageOfRay({x:0, y:0}, {x:1, y:1}, {x:0,y:0, width:1,height:1}), 1, "percentageOfRay({0,0}, {1,1}, {0,0,1,1})");
        equals(LineUtils.percentageOfRay({x:1, y:1}, {x:0, y:0}, {x:0,y:0, width:1,height:1}), 1, "percentageOfRay({1,1}, {0,0}, {0,0,1,1})");
        equals(LineUtils.percentageOfRay({x:1, y:0}, {x:0, y:1}, {x:0,y:0, width:1,height:1}), 1, "percentageOfRay({1,0}, {0,1}, {0,0,1,1})");
        equals(LineUtils.percentageOfRay({x:0, y:1}, {x:1, y:0}, {x:0,y:0, width:1,height:1}), 1, "percentageOfRay({0,1}, {1,0}, {0,0,1,1})");

        // No intercepts
        equals(LineUtils.percentageOfRay({x:0, y:10}, {x:10, y:10}, {x:0,y:0, width:1,height:1}), 0, "percentageOfRay({0,10}, {10,10}, {0,0,1,1})");
        equals(LineUtils.percentageOfRay({x:10, y:0}, {x:10, y:10}, {x:0,y:0, width:1,height:1}), 0, "percentageOfRay({10,0}, {10,10}, {0,0,1,1})");

        // Not connected to the edge cases
        equals(LineUtils.percentageOfRay({x:1, y:2}, {x:2, y:3}, {x:0,y:0, width:10,height:10}), 0.125, "percentageOfRay({1,2}, {2,3}, {0,0,10,10})");
        equals(LineUtils.percentageOfRay({x:2, y:3}, {x:1, y:2}, {x:0,y:0, width:10,height:10}), 0.5, "percentageOfRay({2,3}, {1,2}, {0,0,10,10})");

        equals(LineUtils.percentageOfRay({x:8, y:2}, {x:6, y:4}, {x:0,y:0, width:10,height:10}), 0.25, "percentageOfRay({8,2}, {6,4}, {0,0,10,10})");
        equals(LineUtils.percentageOfRay({x:8, y:2}, {x:9, y:1}, {x:0,y:0, width:10,height:10}), 0.5, "percentageOfRay({2,8}, {9,1}, {0,0,10,10})");

        equals(LineUtils.percentageOfRay({x:8, y:2}, {x:6, y:4}, {x:-1,y:-1, width:11,height:11}), 0.25, "percentageOfRay({8,2}, {6,4}, {-1,-1,11,11})");
        equals(LineUtils.percentageOfRay({x:8, y:2}, {x:9, y:1}, {x:-1,y:-1, width:11,height:11}), 0.5, "percentageOfRay({2,8}, {9,1}, {-1,-1,11,11})");

        // Units
        equals(LineUtils.percentageOfRay({x:0, y:0}, {x:0, y:"1%"}, {x:0,y:0, width:"1%",height:"1%"}), 1, "percentageOfRay({0,0}, {0,1%}, {0,0,1%,1%})");
        equals(LineUtils.percentageOfRay({x:0, y:0}, {x:"1%", y:"1%"}, {x:0,y:0, width:"1%",height:"1%"}), 1, "percentageOfRay({0,0}, {1%,1%}, {0,0,1%,1%})");
        deepEqual(LineUtils.percentageOfRay({x:0, y:0}, {x:0, y:"1%"}, {x:0,y:0, width:1,height:1}), NaN, "percentageOfRay({0,0}, {0,1%}, {0,0,1,1})");
    });


    test("isOnEdge", function() {
        expect(29);

        equals(LineUtils.isOnEdge({x:0, y:0}, {x:0,y:0, width:10,height:10}), true, "isOnEdge({0,0}, {10,10})");
        equals(LineUtils.isOnEdge({x:1, y:1}, {x:0,y:0, width:10,height:10}), false, "isOnEdge({1,1}, {10,10})");
        equals(LineUtils.isOnEdge({x:1, y:0}, {x:0,y:0, width:10,height:10}), true, "isOnEdge({1,0}, {10,10})");
        equals(LineUtils.isOnEdge({x:0, y:1}, {x:0,y:0, width:10,height:10}), true, "isOnEdge({0,1}, {10,10})");
        equals(LineUtils.isOnEdge({x:10, y:10}, {x:0,y:0, width:10,height:10}), true, "isOnEdge({10,10}, {10,10})");
        equals(LineUtils.isOnEdge({x:10, y:0}, {x:0,y:0, width:10,height:10}), true, "isOnEdge({10,0}, {10,10})");
        equals(LineUtils.isOnEdge({x:0, y:10}, {x:0,y:0, width:10,height:10}), true, "isOnEdge({0,10}, {10,10})");
        equals(LineUtils.isOnEdge({x:-10, y:-10}, {x:0,y:0, width:10,height:10}), false, "isOnEdge({-10,-10}, {10,10})");
        equals(LineUtils.isOnEdge({x:-10, y:0}, {x:0,y:0, width:10,height:10}), false, "isOnEdge({-10,0}, {10,10})");
        equals(LineUtils.isOnEdge({x:0, y:-10}, {x:0,y:0, width:10,height:10}), false, "isOnEdge({0,-10}, {10,10})");
        equals(LineUtils.isOnEdge({x:20, y:20}, {x:0,y:0, width:10,height:10}), false, "isOnEdge({20,20}, {10,10})");
        equals(LineUtils.isOnEdge({x:20, y:0}, {x:0,y:0, width:10,height:10}), false, "isOnEdge({20,0}, {10,10})");
        equals(LineUtils.isOnEdge({x:0, y:20}, {x:0,y:0, width:10,height:10}), false, "isOnEdge({0,20}, {10,10})");

        equals(LineUtils.isOnEdge({x:0, y:0}, {x:0,y:0, width:"10%",height:"10%"}), true, "isOnEdge({0,0}, {10%,10%})");
        equals(LineUtils.isOnEdge({x:"1%", y:"1%"}, {x:0,y:0, width:"10%",height:"10%"}), false, "isOnEdge({1%,1%}, {10%,10%})");
        equals(LineUtils.isOnEdge({x:"1%", y:0}, {x:0,y:0, width:"10%",height:"10%"}), true, "isOnEdge({1%,0}, {10%,10%})");
        equals(LineUtils.isOnEdge({x:0, y:"1%"}, {x:0,y:0, width:"10%",height:"10%"}), true, "isOnEdge({0,1%}, {10%,10%})");
        equals(LineUtils.isOnEdge({x:"10%", y:"10%"}, {x:0,y:0, width:"10%",height:"10%"}), true, "isOnEdge({10%,1%0%}, {10%,10%})");
        equals(LineUtils.isOnEdge({x:"10%", y:0}, {x:0,y:0, width:"10%",height:"10%"}), true, "isOnEdge({10%,0}, {10%,10%})");
        equals(LineUtils.isOnEdge({x:0, y:"10%"}, {x:0,y:0, width:"10%",height:"10%"}), true, "isOnEdge({0,10%}, {10%,10%})");
        equals(LineUtils.isOnEdge({x:"-10%", y:"-10%"}, {x:0,y:0, width:"10%",height:"10%"}), false, "isOnEdge({-10%,-10%}, {10%,10%})");
        equals(LineUtils.isOnEdge({x:"-10%", y:0}, {x:0,y:0, width:"10%",height:"10%"}), false, "isOnEdge({-10%,0}, {10%,10%})");
        equals(LineUtils.isOnEdge({x:0, y:"-10%"}, {x:0,y:0, width:"10%",height:"10%"}), false, "isOnEdge({0,-10%}, {10%,10%})");
        equals(LineUtils.isOnEdge({x:"20%", y:"20%"}, {x:0,y:0, width:"10%",height:"10%"}), false, "isOnEdge({20%,20%}, {10%,10%})");
        equals(LineUtils.isOnEdge({x:"20%", y:0}, {x:0,y:0, width:"10%",height:"10%"}), false, "isOnEdge({20%,0}, {10%,10%})");
        equals(LineUtils.isOnEdge({x:0, y:"20%"}, {x:0,y:0, width:"10%",height:"10%"}), false, "isOnEdge({0,20%}, {10%,10%})");

        equals(LineUtils.isOnEdge({x:10.5, y:10.5}, {x:0,y:0, width:10.5,height:10.5}), true, "isOnEdge({10.5,10.5}, {10.5,10.5})");
        equals(LineUtils.isOnEdge({x:1.5, y:1.5}, {x:0,y:0, width:10.5,height:10.5}), false, "isOnEdge({1.5,1.5}, {10.5,10.5})");

        deepEqual(LineUtils.isOnEdge({x:"1%", y:0}, {x:0, y:1, width:10,height:10}), NaN, "isOnEdge({1%,0}, {0,1})");
    });

    test("lineIntercepts", function() {
        expect(29);

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

        // Percents
        deepEqual(LineUtils.lineIntercepts({x:0, y:0}, {x:0, y:"1.5%"}, {x:0,y:0, width:"1.5%",height:"1.5%"}), [{x:0, y:0}, {x:0, y:"1.5%"}], "lineIntercepts({0,0}, {0,1.5%}, {0,0,1.5%,1.5%})");
        deepEqual(LineUtils.lineIntercepts({x:0, y:0}, {x:"1.5%", y:"1.5%"}, {x:0,y:0, width:"1.5%",height:"1.5%"}), [{x:0, y:0}, {x:"1.5%", y:"1.5%"}], "lineIntercepts({0,0}, {1.5%,1.5%}, {0,0,1.5%,1.5%})");

        // Units
        deepEqual(LineUtils.lineIntercepts({x:0, y:0}, {x:0, y:"1%"}, {x:0,y:0, width:"1%",height:"1%"}), [{x:0, y:0}, {x:0, y:"1%"}], "lineIntercepts({0,0}, {0,1%}, {0,0,1%,1%})");
        deepEqual(LineUtils.lineIntercepts({x:0, y:0}, {x:"1%", y:"1%"}, {x:0,y:0, width:"1%",height:"1%"}), [{x:0, y:0}, {x:"1%", y:"1%"}], "lineIntercepts({0,0}, {1%,1%}, {0,0,1%,1%})");
        deepEqual(LineUtils.lineIntercepts({x:0, y:0}, {x:0, y:"1%"}, {x:0,y:0, width:1,height:1}), NaN, "lineIntercepts({0,0}, {0,1%}, {0,0,1,1})");
    });

    test("slopeInRads", function() {
        // Testing conditional logic only, assuming that the math is correct
        expect(19);
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

        equals(LineUtils.slopeInRads({x:0, y:0}, {x:1.5, y:0}), 0, "slopeInRads({0,0}, {1.5,0})");
        equals(LineUtils.slopeInRads({x:1.5, y:0}, {x:0, y:0}), Math.PI, "slopeInRads({1.5,0}, {0,0})");

        equals(LineUtils.slopeInRads({x:0, y:0}, {x:0, y:1.5}), Math.PI/2, "slopeInRads({0,0}, {0,1.5})");
        equals(LineUtils.slopeInRads({x:0, y:1.5}, {x:0, y:0}), 3*Math.PI/2, "slopeInRads({0,1.5}, {0,0})");

        equals(LineUtils.slopeInRads({x:0, y:0}, {x:1.5, y:1.5}), Math.PI/4, "slopeInRads({0,0}, {1.5,1.5})");
        equals(LineUtils.slopeInRads({x:1.5, y:1.5}, {x:0, y:0}), 5*Math.PI/4, "slopeInRads({1.5,1.5}, {0,0})");

        deepEqual(LineUtils.slopeInRads({x:"1%", y:"1%"}, {x:1, y:0}), NaN, "slopeInRads({1%,1%}, {1,0})");
    });
});
