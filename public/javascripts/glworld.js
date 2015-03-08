"use strict";

var $ = require("jquery");
var EventEmitter = require("eventEmitter");
var screen = require("./screen");
var settings = require("./settings");
var utils = require("./utils");
var THREE = require("threejs");

var startTime = Date.now();
var lastRotateY = 0;
var rotateYAccumulate = 0;

var $starName = $('#star-name');
var $cssContainer = $('#css-container');
var $detailContainer = $('#detailContainer');

var events = new EventEmitter();

var markerThreshold = {
    min: 400,
    max: 1500
};

// Clear cross origin flags
THREE.ImageUtils.crossOrigin = null;

var scene = new THREE.Scene();
scene.add(new THREE.AmbientLight(0x505050));

var rotating = new THREE.Object3D();
var galacticCentering = new THREE.Object3D();
var translating = new THREE.Object3D();

galacticCentering.add(translating);
rotating.add(galacticCentering);

scene.add(rotating);

translating.targetPosition = new THREE.Vector3();
translating.update = function(){
    if (this.easePanning)
        return;

    this.position.lerp(this.targetPosition, 0.1);
    if (this.position.distanceTo(this.targetPosition) < 0.01)
        this.position.copy(this.targetPosition);
};

var renderer = new THREE.WebGLRenderer({
    antialias: settings.antialias,
    alpha: true });

renderer.setSize(screen.width, screen.height);
renderer.domElement.style.width = screen.width + 'px';
renderer.domElement.style.height = screen.height + 'px';

renderer.autoClear = false;
renderer.sortObjects = false;
renderer.generateMipmaps = false;

var maxAniso = renderer.getMaxAnisotropy();

// Setup the camera
var camera = new THREE.PerspectiveCamera(30, screen.width / screen.height, 0.5, 10000000);
camera.position.z = 40000;
camera.rotation.vx = 0;
camera.rotation.vy = 0;
camera.position.target = { x: 0, z: 40000, pz: 40000 };

camera.update = function(){
    if( this.easeZooming )
        return;

    camera.position.z += (camera.position.target.z - camera.position.z) * 0.125;
};

camera.position.y = 0;
camera.scale.z = 0.83;

scene.add(camera);

screen.resize(function (){
    // notify the renderer of the size change
    renderer.setSize(screen.width, screen.height);
    renderer.domElement.style.width = screen.width + 'px';
    renderer.domElement.style.height = screen.height + 'px';

    // update the camera
    camera.aspect = screen.width / screen.height;
    camera.updateProjectionMatrix();
});
// bind the resize event

// turn it 90 deg
var rotateY = Math.PI/2;
var rotateX = Math.PI * 0.05;

$(document).ready(function() {
    document.getElementById("glContainer").appendChild(renderer.domElement);

    events.emitEvent("ready");
    module.exports.ready = function(lambda) { lambda(); };
    animate();
});

module.exports = {
    ready: function(lambda) {
        events.addListener("ready", lambda);
    },
    update: function(lambda) {
        events.addListener("update", lambda);
    },
    camera: camera,
    translating: translating,
    galacticCentering: galacticCentering,
    scene: scene,
    rotating: rotating,
    rotateX: 0,
    rotateY: 0,
    rotateVX: 0,
    rotateVY: 0,
    rotateXMax: 90 * Math.PI/180,
    initialAutoRotate: true
}

function animate() {
    // Make sure the document doesn't scroll
    document.body.scrollTop = document.body.scrollLeft = 0;

    camera.update();
    camera.markersVisible = camera.position.z < markerThreshold.max && camera.position.z > markerThreshold.min;

    lastRotateY = rotateY;

    // Tween the camera if we're not touring.
    module.exports.rotateX += module.exports.rotateVX;
    module.exports.rotateY += module.exports.rotateVY;

    module.exports.rotateVX *= 0.9;
    module.exports.rotateVY *= 0.9;

    if( module.exports.initialAutoRotate )
        module.exports.rotateVY = 0.0015;

    // treat the solar system a bit differently
    // since we are at 0,0,0 floating point percision won't be as big of a problem
    var spinCutoff = 100;
    if( translating.position.length() < 0.0001 ){
        spinCutoff = 2;
    }

    if( camera.position.z < spinCutoff ){
        if( starModel ){
            starModel.rotation.x = module.exports.rotateX;
            starModel.rotation.y = module.exports.rotateY;
        }
        rotating.rotation.x = 0;
        rotating.rotation.y = 0;
    } else {
        rotating.rotation.x = module.exports.rotateX;
        rotating.rotation.y = module.exports.rotateY;
    }

    var isZoomedIn = camera.position.target.z < markerThreshold.min;
    var isZoomedToSolarSystem = camera.position.target.z > markerThreshold.min;

    if (isZoomedIn && camera.position.z < markerThreshold.min && $detailContainer.css('display') == 'none' && $starName.css('display') == 'none') {
        $starName.fadeIn();
    } else if ((isZoomedToSolarSystem || $detailContainer.css('display') != 'none') && $starName.css('opacity') == 1.0) {
        $starName.fadeOut();
    }

    if (isZoomedIn && $cssContainer.css('display') != 'none') {
        $cssContainer.css({ display: 'none' });
    } else if (!isZoomedIn && $cssContainer.css('display') == 'none') {
        $cssContainer.css({ display: 'block' });
    }

    if (isZoomedToSolarSystem && $detailContainer.css('display') != 'none' && !$detailContainer.hasClass('about')) {
        $detailContainer.fadeOut();
    }

    if( $detailContainer.css('display') == 'none'/* && starModel.scale.length() < 10 */){
        camera.position.x *= 0.95;
    } else {
        camera.position.x += (camera.position.target.x - camera.position.x) * 0.95;
    }

    var targetFov = utils.constrain(Math.pow(camera.position.z,2) / 100000, 0.000001, 40);
    camera.fov = targetFov;
    var fovValue = 0.5 / Math.tan(camera.fov * Math.PI / 360) * screen.height;
    camera.updateProjectionMatrix();

    var shaderTiming = (Date.now() - startTime )/ 1000;

    rotateYAccumulate += Math.abs(module.exports.rotateY-lastRotateY) * 5;

    rotating.traverse(function( mesh ){
        if( mesh.update !== undefined ) {
            mesh.update();
        }
    });

    render();

    requestAnimationFrame(animate);

    if ( camera.easeZooming || translating.easePanning ) {
        TWEEN.update();
    }
}

function render() {
    renderer.clear();
    renderer.render( scene, camera );
}
