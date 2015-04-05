var lineMaterial;

var previousInitializeMaterials = null
if (Aleph.Views) {
  previousInitializeMaterials = Aleph.Views.initializeMaterials;
}

function initializeMaterials() {
  if (previousInitializeMaterials) {
    previousInitializeMaterials();
  }
  lineMaterial = new THREE.LineBasicMaterial({color: 0xffa100});
}

function generateLineGenerator(group) {
  return function(fromPosition, toPosition) {
    var geometryLine = new THREE.Geometry();
    geometryLine.vertices.push(new THREE.Vector3(fromPosition.x,
                                                 fromPosition.y,
                                                 fromPosition.z));
    geometryLine.vertices.push(new THREE.Vector3(toPosition.x,
                                                 toPosition.y,
                                                 toPosition.z));

    var line = new THREE.Line(geometryLine, lineMaterial);
    line.fromPosition = fromPosition;
    line.toPosition = toPosition;

    line.onCreate = function() {
      group.add(line);
    }

    line.onDestroy = function() {}

    return line;
  }
}

Namespacer.addTo("Views", {
  initializeMaterials: initializeMaterials,
  generateLineGenerator: generateLineGenerator
});
