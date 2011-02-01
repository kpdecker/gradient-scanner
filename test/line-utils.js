/*
 * Copyright (c) 2011 Kevin Decker (http://www.incaseofstairs.com/)
 * See LICENSE for license information
 */
$(document).ready(function(){
    module("LineUtils");

    test("containingRect", function() {
        expect(6);
        deepEqual(LineUtils.containingRect({x:0, y:0}, {x:0, y:1}), {x:0,y:0, width:1,height:1}, "containingRect({0,0}, {0,1})");
        deepEqual(LineUtils.containingRect({x:0, y:0}, {x:1, y:0}), {x:0,y:0, width:1,height:1}, "containingRect({0,0}, {1,0})");
        deepEqual(LineUtils.containingRect({x:0, y:0}, {x:1, y:1}), {x:0,y:0, width:1,height:1}, "containingRect({0,0}, {1,1})");
        deepEqual(LineUtils.containingRect({x:1, y:1}, {x:0, y:0}), {x:0,y:0, width:1,height:1}, "containingRect({1,1}, {0,0})");
        deepEqual(LineUtils.containingRect({x:1, y:0}, {x:0, y:1}), {x:0,y:0, width:1,height:1}, "containingRect({1,0}, {0,1})");
        deepEqual(LineUtils.containingRect({x:0, y:1}, {x:1, y:0}), {x:0,y:0, width:1,height:1}, "containingRect({0,1}, {1,0})");
    });

    test("slopeInRads", function() {
        // Testing conditional logic only, assuming that the math is correct
        expect(6);
        equals(LineUtils.slopeInRads({x:0, y:0}, {x:1, y:0}), 0, "slopeInRads({0,0}, {1,0})");
        equals(LineUtils.slopeInRads({x:1, y:0}, {x:0, y:0}), Math.PI, "slopeInRads({1,0}, {0,0})");

        equals(LineUtils.slopeInRads({x:0, y:0}, {x:0, y:1}), Math.PI/2, "slopeInRads({0,0}, {0,1})");
        equals(LineUtils.slopeInRads({x:0, y:1}, {x:0, y:0}), 3*Math.PI/2, "slopeInRads({0,1}, {0,0})");

        equals(LineUtils.slopeInRads({x:0, y:0}, {x:1, y:1}), Math.PI/4, "slopeInRads({0,0}, {1,1})");
        equals(LineUtils.slopeInRads({x:1, y:1}, {x:0, y:0}), 5*Math.PI/4, "slopeInRads({1,1}, {0,0})");
    });
});
