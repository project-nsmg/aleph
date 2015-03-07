'use strict';

var $ = require("jquery");
var _ = require("underscore");

var galaxy = require("./galaxy");
var shaders = require("./shaders");
var lensflare = require("./lensflare");
var constrain = require('./utils').constrain;
//CSS/HTML Setup
var masterContainer;

//Graphic Settings
var maxAniso = 1;
var enableDataStar = false;
var enableSkybox = false;
var enableGalaxy = true;
var enableDust = false;
var enableSolarSystem = false;
var enableSpacePlane = false;
var enableStarModel = false;
var enableTour = false;
var enableDirector = false;

//	animation timing
var clock = new THREE.Clock();
var shaderTiming = 0;

var $iconNav = $('#icon-nav');

var $spectralGraph = $('#spectral-graph');

var gradientImage;
var gradientCanvas;

var rtparam = { minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBFormat,
                stencilBufer: false };
var rt;

var antialias = true;

var gui;

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
