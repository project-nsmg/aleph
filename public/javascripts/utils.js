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

module.exports = {
    random: random,
    constrain: constrain
}
