var GROWTH = 0.1;
var SHIP_SPEED = 5;

function Star(id, position) {
  var self = this;

  self.id = id;
  self.position = position;
  self.connectedStars = [];
  self.civilization = null;
  self.population = 0;
  self.lastUpdateTime = Date.now();

  Aleph.Update.add(this);
}

Star.prototype.update = function() {
  var interval = Date.now() - this.lastUpdateTime;
  var self = this;

  if (self.civilization) {
    self.population += GROWTH * interval / 1000;
  }

  _.each(self.connectedStars, function(connectedStar) {
    if (!connectedStar.civilization) {
      if (self.population > 2) {
        self.population -= 1;
        self.civilization.ships.push(new Aleph.Models.Ship(SHIP_SPEED, self, connectedStar));
      }
    }
  });
}

Namespacer.addTo("Models", {
  Star: Star
});
