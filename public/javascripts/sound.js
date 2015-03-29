"use strict";

var $ = require("jquery");

$(document).ready(function() {
    document.getElementById('bgmusicA').addEventListener('ended', function(){
        this.currentTime = 0;
        this.pause();
        var playB = function() {
            document.getElementById('bgmusicB').play();
        }
        setTimeout(playB, 15000);
    }, false);

    document.getElementById('bgmusicB').addEventListener('ended', function(){
        this.currentTime = 0;
        this.pause();
        var playA = function() {
            document.getElementById('bgmusicA').play();
        }
        setTimeout(playA, 15000);
    }, false);

    document.getElementById('bgmusicA').play();

    if(localStorage && localStorage.getItem('sound') == 0){
        muteSound();
    }
});

function muteSound() {
    document.getElementById('bgmusicA').volume = 0;
    document.getElementById('bgmusicB').volume = 0;
    if (localStorage)
        localStorage.setItem('sound', 0);
}

function unmuteSound() {
    document.getElementById('bgmusicA').volume = 1;
    document.getElementById('bgmusicB').volume = 1;
    if (localStorage)
        localStorage.setItem('sound', 1);
}

module.exports = {
    mute: muteSound,
    unmute: unmuteSound
};
