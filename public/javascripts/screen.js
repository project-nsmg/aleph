"use strict";

var EventEmitter = require("eventEmitter");

var events = new EventEmitter();

var width = window.innerWidth;
var height = window.innerHeight
var halfWidth = window.innerWidth / 2;
var halfHeight = window.innerHeight / 2;

function onResize() {
    width = window.innerWidth;
    height = window.innerHeight
    halfWidth = window.innerWidth / 2;
    halfHeight = window.innerHeight / 2;

    module.exports.width = width;
    module.exports.height = height;
    module.exports.halfWidth = halfWidth;
    module.exports.halfHeight = halfHeight;

    events.emitEvent("resize");
}

window.addEventListener("resize", onResize, false);

module.exports = {
    width: width,
    height: height,
    halfWidth: halfWidth,
    halfHeight: halfHeight,
    resize: function(lambda) {
        events.addListener("resize", lambda);
    }
}
