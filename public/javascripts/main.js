"use strict";

var $ = require("jquery");

$(document).ready(function() {

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
