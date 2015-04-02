var RADIUS = 2500;

function Sector(id, amount) {
  var self = this;

  self.id = id;
  self.children = [];

  for (var a = 0; a < amount; a++) {
    var x = Math.random() - 0.5;
    var y = Math.random() - 0.5;
    var z = Math.random() - 0.5;

    var position = new Aleph.Helpers.Vector3(x, y, z);
    position.multiplyScalar(RADIUS);

    self.children[a] = new Aleph.Models.Star(a, position);
  }

  var distanceFunction = function(a, b){
    return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2);
  };

  var points = [];
  for (var i = 0; i < self.children.length; i++) {
    points[i] = {
      x: self.children[i].position.x,
      y: self.children[i].position.y,
      z: self.children[i].position.z,
      id: self.children[i].id
    }
  }
  self.kdtree = new Aleph.Helpers.Kdtree(points, distanceFunction, ["x", "y", "z"]);

  _.each(self.children, function(star) {
    if (Math.random() >= 0.5) {
      var nearest = self.kdtree.nearest({
        x: star.position.x,
        y: star.position.y,
        z: star.position.z
      }, 2);

      if (nearest.length >= 1) {
        var starId = nearest[0][0].id
        star.connectedStars = [ self.children[starId] ];
      }
    }
  });
}

Namespacer.addTo("Models", {
  Sector: Sector
});
