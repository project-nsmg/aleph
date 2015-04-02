if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });

  Meteor.startup(function() {
    var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.z = 1500;

    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 1500, 5000);

    var amount = 200; //density
    var radius = 2500;

    var map = THREE.ImageUtils.loadTexture("images/sprite1.png");
    var materialA = new THREE.SpriteMaterial({map: map, color: 0xffffff, fog: true});
    var materialB = new THREE.SpriteMaterial({map: map, color: 0xff5555, fog: true});

    var group = new THREE.Group();
    var groupSprite = new THREE.Group();
    var groupLine = new THREE.Group();
    group.add(groupSprite);
    group.add(groupLine);
    scene.add(group);

    for (var a = 0; a < amount; a++) {
      var x = Math.random() - 0.5;
      var y = Math.random() - 0.5;
      var z = Math.random() - 0.5;

      var material = materialA;

      var sprite = new THREE.Sprite(material);
      sprite.position.set(x, y, z);
      //sprite.position.normalize();
      sprite.position.multiplyScalar(radius);

      var imageWidth = amount;
      var imageHeight = amount;
      var time = Date.now() / 1000;
      var scale = Math.sin(time + sprite.position.x * 0.01) * 0.3 + 1.0;
      sprite.scale.set(50, 50, 1.0);

      groupSprite.add(sprite);
    }

    var distanceFunction = function(a, b){
      return Math.pow(a[0] - b[0], 2) +  Math.pow(a[1] - b[1], 2) +  Math.pow(a[2] - b[2], 2);
    };
    var positions = new Float32Array(groupSprite.children.length * 3);
    for (var i = 0; i < groupSprite.children.length; i++) {
      positions[i * 3 + 0] = groupSprite.children[i].position.x;
      positions[i * 3 + 1] = groupSprite.children[i].position.y;
      positions[i * 3 + 2] = groupSprite.children[i].position.z;
    }
    var kdtree = new THREE.TypedArrayUtils.Kdtree(positions, distanceFunction, 3);

    var materialLine = new THREE.LineBasicMaterial({color: 0xffa100});
    for (var i = 0; i < groupSprite.children.length; i++) {
      if (i === 0) {
        continue;
      }

      if (Math.random() >= 0.5) {
        var positionsInRange = kdtree.nearest([
          groupSprite.children[i].position.x,
          groupSprite.children[i].position.y,
          groupSprite.children[i].position.z
        ], 2);

        if (positionsInRange.length >= 1) {
          var geometryLine = new THREE.Geometry();
          geometryLine.vertices.push(groupSprite.children[i].position);
          var x = positionsInRange[0][0].obj[0];
          var y = positionsInRange[0][0].obj[1];
          var z = positionsInRange[0][0].obj[2];
          geometryLine.vertices.push(new THREE.Vector3(x, y, z));

          var line = new THREE.Line(geometryLine, materialLine);
          groupLine.add(line);
        }
      }
    }

    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild( renderer.domElement );

    var controls = new THREE.TrackballControls(camera);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = false;
    controls.dynamicDampingFactor = 0.3;
    controls.keys = [65, 83, 68];

    var render = function () {
      renderer.render(scene, camera);
    };
    controls.addEventListener('change', render);

    var animate = function (){
      requestAnimationFrame(animate);

      var time = Date.now() / 1000;

      group.rotation.x = time * 0.5 * 0.01;
      group.rotation.y = time * 0.75 * 0.01;
      group.rotation.z = time * 1.0 * 0.01;

      render();
      controls.update();
    }

    animate();

    var raycaster = new THREE.Raycaster();
    var mouseVector = new THREE.Vector3();

    window.addEventListener('mousemove', onMouseMove, false);
    function onMouseMove(e) {
      mouseVector.x = 2 * (e.clientX / window.innerWidth) - 1;
      mouseVector.y = 1 - 2 * (e.clientY / window.innerHeight);

      raycaster.setFromCamera(mouseVector.clone(), camera);

      var intersects = raycaster.intersectObjects(groupSprite.children);

      groupSprite.children.forEach(function(sprite) {
        sprite.material = materialA;
      });

      for (var i = 0; i < intersects.length; i++) {
        var intersection = intersects[i];
        var obj = intersection.object;

        obj.material = materialB;
      }
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
