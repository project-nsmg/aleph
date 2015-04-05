function render() {
  Aleph.Views.renderer.render(Aleph.Views.scene, Aleph.Views.camera);
};

function animate() {
  requestAnimationFrame(animate);

  Aleph.Update.act();

  var time = Date.now() / 1000;
  //Aleph.Views.groupMain.rotation.set(time * 0.5 * 0.01, time * 0.75 * 0.01, time * 1.0 * 0.01);

  render();
  Aleph.Views.controls.update();
}

var mouseVector, raycaster;
function onMouseMove(e) {
  mouseVector.x = 2 * (e.clientX / window.innerWidth) - 1;
  mouseVector.y = 1 - 2 * (e.clientY / window.innerHeight);

  raycaster.setFromCamera(mouseVector.clone(), Aleph.Views.camera);

  var intersects = raycaster.intersectObjects(Aleph.Views.groupSprite.children);

  Aleph.Views.groupSprite.children.forEach(function(sprite) {
    sprite.stateNormal();
  });

  for (var i = 0; i < intersects.length; i++) {
    var intersection = intersects[i];
    var obj = intersection.object;

    obj.stateTouched();
  }
}

Meteor.startup(function() {
  var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 5000);
  camera.position.z = 1500;

  var scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 1500, 5000);

  var groupMain = new THREE.Group();
  scene.add(groupMain);

  var groupSprite = new THREE.Group();
  groupMain.add(groupSprite);

  var groupLine = new THREE.Group();
  groupMain.add(groupLine);

  var groupShip = new THREE.Group();
  groupMain.add(groupShip);

  Aleph.Views.initializeMaterials();
  Aleph.Models.Ship.generateView = Aleph.Views.generateSpriteGenerator(10,
                                                                       groupShip);
  Aleph.Models.Ship.generateLineView = Aleph.Views.generateLineGenerator(groupLine);
  Aleph.Models.Star.generateView = Aleph.Views.generateSpriteGenerator(50,
                                                                       groupSprite);
  var currentSector = new Aleph.Models.Sector(new Aleph.Helpers.Vector2(0, 0),
                                              200);
  var currentCivilization = new Aleph.Models.Civilization();

  _.each(currentSector.children, function(star) {
    if (Math.random() < 0.1) {
      currentCivilization.colonize(star);
    }
  });
  if (!currentSector.children[0].civilization) {
    currentCivilization.colonize(currentSector.children[0]);
  }

  var renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  var controls = new THREE.TrackballControls(camera);
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = false;
  controls.dynamicDampingFactor = 0.3;
  controls.keys = [65, 83, 68];

  raycaster = new THREE.Raycaster();
  mouseVector = new THREE.Vector3();

  Namespacer.addTo("Views", {
    camera: camera,
    scene: scene,
    renderer: renderer,
    controls: controls,
    groupMain: groupMain,
    groupSprite: groupSprite,
    groupLine: groupLine,
    groupShip: groupShip,
    currentSector: currentSector
  });

  window.addEventListener('mousemove', onMouseMove, false);
  controls.addEventListener('change', render);

  animate();
});
