var $ = require('jquery');
var EventEmitter = require("eventEmitter");

var shaderList = ['shaders/galacticstars',
                  'shaders/galacticdust'];

var events = new EventEmitter();

module.exports = {
    ready: function(lambda) {
        events.addListener("ready", lambda);
    }
}

var list = shaderList;
var shaders = module.exports;

var expectedFiles = list.length * 2;
var loadedFiles = 0;

function makeCallback(name, type) {
    return function(data){
        if (shaders[name] === undefined) {
            shaders[name] = {};
        }

        shaders[name][type] = data;

        // check if done
        loadedFiles++;
        if (loadedFiles == expectedFiles) {
            events.emitEvent("ready");
            module.exports.ready = function(lambda) { lambda(); };
        }
    };
}

for (var i=0; i<list.length; i++) {
    var vertexShaderFile = list[i] + '.vsh';
    var fragmentShaderFile = list[i] + '.fsh';

    // find the filename, use it as the identifier
    var splitted = list[i].split('/');
    var shaderName = splitted[splitted.length-1];
    $(document).load(vertexShaderFile, makeCallback(shaderName, 'vertex'));
    $(document).load(fragmentShaderFile, makeCallback(shaderName, 'fragment'));
}
