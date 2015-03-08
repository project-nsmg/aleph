"use strict";

var $ = require("jquery");

var gradientImage;
var gradientCanvas;

$(document).ready(function() {
    gradientImage = document.createElement('img');
    gradientImage.src = 'images/star_color_modified.png';

    gradientCanvas = document.createElement('canvas');
    gradientCanvas.width = gradientImage.width;
    gradientCanvas.height = gradientImage.height;
    gradientCanvas.getContext('2d').drawImage(gradientImage, 0, 0,
                                              gradientImage.width,
                                              gradientImage.height);
    gradientCanvas.getColor = function(percentage) {
        return this.getContext('2d')
            .getImageData(0, percentage * gradientImage.height, 1, 1).data;
    }

    setTimeout(function() {
        var s = 'scale(1.0)';

        $('#layout').css({
            webkitTransform: s,
            mozTransform: s,
            msTransform: s,
            oTransform: s,
            transform: s
        });

        $('#loader').fadeOut(250);
    }, 500);
});
