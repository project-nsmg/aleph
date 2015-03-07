var $ = require("jquery");
var EventEmitter = require("eventEmitter");
var events = new EventEmitter();

var controllers = {
    viewSize: 0.6,
    datastarSize: 1.0,
    sceneSize: 1000.0,
    sol: function(){ camera.position.z = 1.1; },
    solarsystem: function(){ camera.position.z = 18; },
    hipparcos: function(){ camera.position.z = 1840; },
    milkyway: function(){ camera.position.z = 40000; },
};

module.exports = {
    controllers: controllers,
    ready: function(lambda) {
        events.addListener("ready", lambda);
    }
};

$(document).ready(function() {
    var gui = new dat.GUI();
    gui.domElement.style.display = 'none';

    var c = gui.add(controllers, 'viewSize', 0.01, 4.0);
    c.onChange(function(v) {
        camera.scale.z = v;
    });

    c = gui.add(controllers, 'datastarSize', 0.01, 10.0);
    c = gui.add(controllers, 'sceneSize', 1, 50000);

    c = gui.add(controllers, 'sol');
    c = gui.add(controllers, 'solarsystem');
    c = gui.add(controllers, 'hipparcos');
    c = gui.add(controllers, 'milkyway');

    // c = gui.add(camera, 'fov', 1.0, 200.0 );

    module.exports.gui = gui;
    events.emitEvent("ready");
    module.exports.ready = function(lambda) { lambda(); };
});
