function Star(model) {
  var material = Aleph.Views.Star.materials.normal;
  var sprite = new THREE.Sprite(material);
  sprite.position.set(model.position.x, model.position.y, model.position.z);
  sprite.scale.set(50, 50, 1.0);

  Aleph.Views.groupSprite.add(sprite);

  this.model = model;
  this.sprite = sprite;
}

Star.initializeMaterials = function() {
  var map = THREE.ImageUtils.loadTexture("images/sprite1.png");

  Star.materials = {
    normal: new THREE.SpriteMaterial({map: map, color: 0xffffff, fog: true}),
    touched: new THREE.SpriteMaterial({map: map, color: 0xff5555, fog: true})
  };
}

Star.prototype.stateNormal = function() {
  this.sprite.material = Aleph.Views.Star.materials.normal;
}

Star.prototype.stateTouched = function() {
  this.sprite.material = Aleph.Views.Star.materials.touched;
}

Namespacer.addTo("Views", {
  Star: Star
});
