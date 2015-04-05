var SPEED = 20;

function Ship(fromStar, toStar, civilization) {
  var self = this;

  self.progress = 0;
  self.speed = SPEED;

  var a = fromStar.position;
  var b = toStar.position;
  self.distance = Math.sqrt(Math.pow(a.x - b.x, 2) +
                            Math.pow(a.y - b.y, 2) +
                            Math.pow(a.z - b.z, 2));
  self.position = fromStar.position.clone();
  self.lastUpdateTime = Date.now();
  self.fromStar = fromStar;
  self.toStar = toStar;
  self.civilization = civilization;

  self.view = Ship.generateView(self.position);
  self.line = Ship.generateLineView(fromStar.position, fromStar.position);
  Aleph.Update.add(this);

  self.view.onCreate();
  self.line.onCreate();
}

Ship.prototype.update = function() {
  var self = this;
  var interval = Date.now() - this.lastUpdateTime;

  self.view.stateTouched();
  self.progress += (interval * self.speed / 1000) / self.distance;
  if (self.progress > 1) { self.progress = 1; }
  if (self.progress < 0) { self.progress = 0; }

  if (self.progress === 1) {
    var index = self.civilization.ships.indexOf(self);
    if (index > -1) self.civilization.ships.slice(index, 1);

    self.view.onDestroy();
    self.civilization.colonize(this.toStar);
    Aleph.Update.remove(this);
    self.line.geometry.vertices[1].set(this.toStar.position.x,
                                       this.toStar.position.y,
                                       this.toStar.position.z);
    self.line.geometry.verticesNeedUpdate = true;
  } else {
    self.position.subVectors(self.toStar.position, self.fromStar.position);
    self.position.multiplyScalar(self.progress);
    self.position.add(self.fromStar.position);
    self.view.position.set(self.position.x, self.position.y, self.position.z);
    self.line.geometry.vertices[1].set(self.position.x, self.position.y, self.position.z);
    self.line.geometry.verticesNeedUpdate = true;
  }

  self.lastUpdateTime = Date.now();
}

Namespacer.addTo("Models", {
  Ship: Ship
});
