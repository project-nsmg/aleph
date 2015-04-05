var GROWTH = 0.1;

function Star(id, position, sector) {
  var self = this;

  self.id = id;
  self.position = position;
  self.connectedStars = [];
  self.civilization = null;
  self.population = null;
  self.lastUpdateTime = Date.now();
  self.sector = sector;
  self.approachedStars = [];

  self.view = Star.generateView(position);
  Aleph.Update.add(this);

  self.view.onCreate();
}

Star.prototype.update = function() {
  var self = this;
  var interval = Date.now() - this.lastUpdateTime;

  if (self.civilization) {
    self.view.stateTouched();

    self.population += GROWTH * interval / 1000;

    _.each(self.connectedStars, function(connectedStar) {
      if ((!connectedStar.civilization) &&
          (self.approachedStars.indexOf(connectedStar) == -1) &&
          (self.population > 2)) {
        self.population -= 1;
        self.civilization.ships.push(new Aleph.Models.Ship(self, connectedStar, self.civilization));
        self.approachedStars.push(connectedStar);
      }
    });
  } else {
    self.view.stateNormal();
  }
}

Namespacer.addTo("Models", {
  Star: Star
});
