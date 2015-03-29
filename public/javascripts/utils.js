"use strict";

var $ = require('jquery');

function random(low, high) {
    if (low >= high) return low;
    var diff = high - low;
    return (Math.random() * diff) + low;
}

function constrain(v, min, max){
    if( v < min )
        v = min;
    else
        if( v > max )
            v = max;
    return v;
}

var $loadText = $('#loadtext');
function setLoadMessage(msg){
    $loadText.html(msg+"&hellip;");
}

function map(v, i1, i2, o1, o2) {
    return o1 + (o2 - o1) * (v - i1) / (i2 - i1);
}

module.exports = {
    random: random,
    constrain: constrain,
    setLoadMessage: setLoadMessage,
    map: map
}
