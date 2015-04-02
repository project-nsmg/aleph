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
    return Math.pow(a.position.x - b.position.x, 2) +
      Math.pow(a.position.y - b.position.y, 2) +
      Math.pow(a.position.z - b.position.z, 2);
  };

  var stars = new Float32Array(self.children.length);
  for (var i = 0; i < self.children.length; i++) {
    stars[i] = self.children[i];
  }
  self.kdtree = new Aleph.Helpers.Kdtree(stars, distanceFunction, 1);

  _.each(self.children, function(star) {
    if (Math.random() >= 0.5) {
      var positionsInRange = self.kdtree.nearest([
        star.id,
        star.position.x,
        star.position.y,
        star.position.z
      ], 2);

      if (positionsInRange.length >= 1) {
        console.log(positionsInRange[0][0].obj[0]);

        var starId = positionsInRange[0][0].obj[0];
        star.connectedStars = [ self.children[starId] ];
      }
    }
  });
}

Namespacer.addTo("Models", {
  Sector: Sector
});
