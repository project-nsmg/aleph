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
    var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2100);
    camera.position.z = 1500;

    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 1500, 2100);

    var amount = 200; //density
    var radius = 2500;

    var mapA = THREE.ImageUtils.loadTexture("images/sprite1.png");
    var materialA = new THREE.SpriteMaterial({map: mapA, color: 0xffffff, fog: true});

    var mapB = THREE.ImageUtils.loadTexture("images/sprite2.png");
    var materialB = new THREE.SpriteMaterial({map: mapB, color: 0xffffff, fog: true});

    var group = new THREE.Group();
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

      group.add(sprite);
    }
    scene.add(group);

    var distanceFunction = function(a, b){
      return Math.pow(a[0] - b[0], 2) +  Math.pow(a[1] - b[1], 2) +  Math.pow(a[2] - b[2], 2);
    };
    var positions = new Float32Array(group.children.length * 3);
    for (var i = 0; i < group.children.length; i++) {
      positions[i * 3 + 0] = group.children[i].position.x;
      positions[i * 3 + 1] = group.children[i].position.y;
      positions[i * 3 + 2] = group.children[i].position.z;
    }
    var kdtree = new THREE.TypedArrayUtils.Kdtree(positions, distanceFunction, 3);

    var groupLine = new THREE.Group();
    var materialLine = new THREE.LineBasicMaterial({color: 0xffa100});
    for (var i = 0; i < group.children.length; i++) {
      if (i === 0) {
        continue;
      }

      if (Math.random() >= 0.5) {
        var positionsInRange = kdtree.nearest([
          group.children[i].position.x,
          group.children[i].position.y,
          group.children[i].position.z
        ], 2);

        if (positionsInRange.length >= 1) {
          var geometryLine = new THREE.Geometry();
          geometryLine.vertices.push(group.children[i].position);
          var x = positionsInRange[0][0].obj[0];
          var y = positionsInRange[0][0].obj[1];
          var z = positionsInRange[0][0].obj[2];
          geometryLine.vertices.push(new THREE.Vector3(x, y, z));

          var line = new THREE.Line(geometryLine, materialLine);
          groupLine.add(line);
        }
      }
    }
    group.add(groupLine);

    var renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild( renderer.domElement );

    var render = function () {
      requestAnimationFrame(render);

      var time = Date.now() / 1000;

      group.rotation.x = time * 0.5 * 0.01;
      group.rotation.y = time * 0.75 * 0.01;
      group.rotation.z = time * 1.0 * 0.01;

      renderer.render(scene, camera);
    };

    render();
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
