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

    var amount = 200;
    var radius = 500;

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
      sprite.position.normalize();
      sprite.position.multiplyScalar(radius);

      var imageWidth = amount;
      var imageHeight = amount;
      var time = Date.now() / 1000;
      var scale = Math.sin(time + sprite.position.x * 0.01) * 0.3 + 1.0;
      sprite.scale.set(scale * imageWidth, scale * imageHeight, 1.0);

      group.add(sprite);
    }
    scene.add(group);

    var renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild( renderer.domElement );

    var render = function () {
      requestAnimationFrame(render);

      var time = Date.now() / 1000;

      group.rotation.x = time * 0.5;
      group.rotation.y = time * 0.75;
      group.rotation.z = time * 1.0;

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
