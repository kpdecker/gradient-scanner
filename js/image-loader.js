/*
 * Copyright (c) 2011 Kevin Decker (http://www.incaseofstairs.com/)
 * See LICENSE for license information
 */
/*global $,jQuery,LineUtils,ImageDataUtils,UserImageCache,GradientScanner */
$(document).ready(function() {
    var canvas = $("#imageDisplay"),
        context = canvas[0].getContext("2d"),
        pathToImage = $("#pathToImage");

    function errorHandler(code) {
        $("#errorMsg").html("*** " + "Failed to load image. Error code: " + JSON.stringify(code));
    }

    // Generic loader used by the UI and the seeder
    GradientScanner.loadImage = function(image, name) {
        canvas.attr({
            width: image.width,
            height: image.height
        });

        context.drawImage(image, 0, 0);

        pathToImage.val(name);

        GradientScanner.edgeContext = ImageDataUtils.getEdgeContext(context.canvas);
        $(document).trigger(new jQuery.Event("imageLoaded"));
    };

    // User Image Cache loader
    var loader = new Image();
    $(loader).load(function() {
            GradientScanner.loadImage(this, UserImageCache.getDisplayName());
        })
        .error(function() { errorHandler(); });
    UserImageCache.setImageEl(loader);
    UserImageCache.setRemoteProxy("http://" + location.host + "/proxy?href=");

    // User Input Setup
    pathToImage.change(function(event) {
        $("#errorMsg").html("");
        UserImageCache.load(pathToImage.val(), errorHandler);
    });

    // File API
    if (UserImageCache.isLocalSupported()) {
        $("#localImage").bind("change", function(event) {
            var file = this.files[0];

            $("#errorMsg").html("");
            UserImageCache.load(file, errorHandler);
        });

        // Unhide the browse button if the current browser supports local files
        $(".no-local").removeClass("no-local");
    }
});
