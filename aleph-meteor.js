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
    var materialLine = new THREE.LineBasicMaterial({color: 0xffa100});

    var group = new THREE.Group();
    var groupSprite = new THREE.Group();
    var groupLine = new THREE.Group();
    group.add(groupSprite);
    group.add(groupLine);
    scene.add(group);

    var currentSector = new Aleph.Models.Sector(new Aleph.Helpers.Vector2(0, 0),
                                                200);

    _.each(currentSector.children, function(star) {
      var material = materialA;
      var sprite = new THREE.Sprite(material);
      sprite.position.set(star.position.x, star.position.y, star.position.z);
      sprite.scale.set(50, 50, 1.0);

      groupSprite.add(sprite);
      star.sprite = sprite;

      _.each(star.connectedStars, function(connectedStar) {
        console.log(star.connectedStars);

        var geometryLine = new THREE.Geometry();
        geometryLine.vertices.push(new THREE.Vector3(star.position.x,
                                                     star.position.y,
                                                     star.position.z));
        geometryLine.vertices.push(new THREE.Vector3(connectedStar.position.x,
                                                     connectedStar.position.y,
                                                     connectedStar.position.z));

        var line = new THREE.Line(geometryLine, materialLine);
        groupLine.add(line);
      });
    });

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
