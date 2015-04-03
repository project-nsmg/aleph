function Ship(model) {
  var material = Aleph.Views.Ship.materials.normal;
  var sprite = new THREE.Sprite(material);
  sprite.position.set(model.position.x, model.position.y, model.position.z);
  sprite.scale.set(10, 10, 1.0);

  Aleph.Views.groupShip.add(sprite);

  this.model = model;
  this.sprite = sprite;

  Aleph.Update.add(this);
}

Ship.prototype.update = function() {
  this.sprite.position.set(this.model.position.x, this.model.position.y, this.model.position.z);
}

Ship.initializeMaterials = function() {
  var map = THREE.ImageUtils.loadTexture("images/sprite1.png");

  Ship.materials = {
    normal: new THREE.SpriteMaterial({map: map, color: 0xff5555, fog: true}),
  };
}

Namespacer.addTo("Views", {
  Ship: Ship
});
