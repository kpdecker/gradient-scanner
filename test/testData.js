/*
 * Copyright (c) 2011 Kevin Decker (http://www.incaseofstairs.com/)
 * See LICENSE for license information
 */
$(document).ready(function() {
    function drawGradient(x, y, r1, r2) {
        var radialGradient = context.createRadialGradient(x, y, r1, x, y, r2);
        radialGradient.addColorStop(0, "red");
        radialGradient.addColorStop(1, "green");
        context.fillStyle = radialGradient;

        context.beginPath();
        context.arc(x, y, r2, 0, 360, false);
        context.fill();
        context.closePath();
    }
    var canvas = document.getElementById("imageDisplay"),
        context = canvas.getContext("2d");

    context.fillRect(0,0,50,50);

    var linearGradient = context.createLinearGradient(100, 100, 100, 600);
    linearGradient.addColorStop(0.0, "black");
    linearGradient.addColorStop(0.5, "red");
    linearGradient.addColorStop(1.0, "blue");
    context.fillStyle = linearGradient;
    context.fillRect(100,100,500,600);

    drawGradient(75, 75, 25, 55);
    drawGradient(225, 75, 5, 55);

    var img = document.createElement("img");
    $(img).load(function() {
        context.drawImage(img, 100, 100);
    });

    img.src = "test/css-gradient-dropdown-menu.gif";

    setTimeout(function() {
        var mousedown = jQuery.Event("mousedown");
        mousedown.pageX = 189;
        mousedown.pageY = 503;

        var mousemove = jQuery.Event("mousemove");
        mousemove.pageX = 189;
        mousemove.pageY = 142;

        var mouseup = jQuery.Event("mouseup");
        mouseup.pageX = 189;
        mouseup.pageY = 142;

        $(canvas).trigger(mousedown)
                .trigger(mousemove)
                .trigger(mouseup);
    }, 500);
});