var normalMaterial, touchedMaterial;

var previousInitializeMaterials;
if (Aleph.Views) {
  previousInitializeMaterials = Aleph.initializeMaterials;
}

function initializeMaterials() {
  if (previousInitializeMaterials) {
    previousInitializeMaterials();
  }
  var map = THREE.ImageUtils.loadTexture("images/sprite1.png");
  normalMaterial = new THREE.SpriteMaterial({map: map, color: 0xffffff, fog: true});
  touchedMaterial = new THREE.SpriteMaterial({map: map, color: 0xff5555, fog: true});
};

function generateSpriteGenerator(scale, group) {
  return function(position) {
    var material = normalMaterial;
    var sprite = new THREE.Sprite(material);
    sprite.scale.set(scale, scale, 1.0);
    sprite.position.set(position.x, position.y, position.z);

    sprite.onCreate = function() {
      group.add(sprite);
    }

    sprite.onDestroy = function() {
      group.remove(sprite);
    }

    sprite.stateNormal = function() {
      sprite.material = normalMaterial;
    }

    sprite.stateTouched = function() {
      sprite.material = touchedMaterial;
    }

    return sprite;
  }
}

Namespacer.addTo("Views", {
  initializeMaterials: initializeMaterials,
  generateSpriteGenerator: generateSpriteGenerator
});
