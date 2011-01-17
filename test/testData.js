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

        edgeContext = ImageDataUtils.getEdgeContext(canvas);
    });

    img.src = "test/css-gradient-dropdown-menu.gif";

    setTimeout(function() {
        var offset = $("#imageDisplay").offset();

        var mousedown = jQuery.Event("mousedown");
        mousedown.pageX = 189;
        mousedown.pageY = 503;

        mousedown.pageX = 232;
        mousedown.pageY = 81;

        mousedown.pageX = 366;
        mousedown.pageY = 100;
/*
        mousedown.pageX = 225;
        mousedown.pageY = 73;
/*
        mousedown.pageX = 586;
        mousedown.pageY = 100;

        mousedown.pageX = 386;
        mousedown.pageY = 406;
*/
        mousedown.pageX += offset.left;
        mousedown.pageY += offset.top;

        var mousemove = jQuery.Event("mousemove");
        mousemove.pageX = 189;
        mousemove.pageY = 142;

        mousemove.pageX = 79;
        mousemove.pageY = 81;

        mousemove.pageX = 366;
        mousemove.pageY = 600;
/*
        mousemove.pageX = 67;
        mousemove.pageY = 73;
/*
        mousemove.pageX = 586;
        mousemove.pageY = 600;

        mousemove.pageX = 224;
        mousemove.pageY = 257;
*/
        mousemove.pageX += offset.left;
        mousemove.pageY += offset.top;

        $(canvas).trigger(mousedown)
                .trigger(mousemove)
                .trigger(jQuery.Event("mouseup"));
    }, 500);
});
