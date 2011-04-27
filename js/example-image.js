$(document).ready(function() {
    
    var img = document.createElement("img");
    $(img).load(function() {
        GradientScanner.loadImage(img, "example image");
    });
    img.src = "css/gradient-example.png";

    $(document).bind("imageLoaded", function lineSeed() {
        $(this).unbind("imageLoaded", lineSeed);

        var offset = $("#imageDisplay").offset();

        var mousedown = jQuery.Event("mousedown");
        mousedown.which = 1;

        mousedown.pageX = 300;
        mousedown.pageY = 1;

        mousedown.pageX += offset.left;
        mousedown.pageY += offset.top;

        var mousemove = jQuery.Event("mousemove");
        mousemove.which = 1;

        mousemove.pageX = 300;
        mousemove.pageY = 89;

        mousemove.pageX += offset.left;
        mousemove.pageY += offset.top;

        $("#imageDisplay")
                .trigger(mousedown)
                .trigger(mousemove)
                .trigger(jQuery.Event("mouseup"));
    });
});
