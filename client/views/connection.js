function Connection(fromModel, toModel) {
  var geometryLine = new THREE.Geometry();
  geometryLine.vertices.push(new THREE.Vector3(fromModel.position.x,
                                               fromModel.position.y,
                                               fromModel.position.z));
  geometryLine.vertices.push(new THREE.Vector3(toModel.position.x,
                                               toModel.position.y,
                                               toModel.position.z));

  var line = new THREE.Line(geometryLine, Connection.materials.normal);
  Aleph.Views.groupLine.add(line);

  this.fromModel = fromModel;
  this.toModel = toModel;
  this.line = line;
}

Connection.initializeMaterials = function() {
  Connection.materials = {
    normal: new THREE.LineBasicMaterial({color: 0xffa100})
  };
};

Namespacer.addTo("Views", {
  Connection: Connection
});
