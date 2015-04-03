function Ship(speed, fromStar, toStar) {
  this.progress = 0;
  this.speed = speed;

  var a = fromStar.position;
  var b = toStar.position;
  this.distance = Math.sqrt(Math.pow(a.x - b.x, 2) +
                            Math.pow(a.y - b.y, 2) +
                            Math.pow(a.z - b.z, 2));

  this.position = fromStar.position.clone();
  this.lastUpdateTime = Date.now();
  this.fromStar = fromStar;
  this.toStar = toStar;

  Aleph.Update.add(this);
}

Ship.prototype.update = function() {
  var interval = Date.now() - this.lastUpdateTime;

  this.progress += (interval * this.speed / 1000) / this.distance;
  if (this.progress > 1) { this.progress = 1; }
  if (this.progress < 0) { this.progress = 0; }

  this.position.subVectors(this.toStar.position, this.fromStar.position);
  this.position.multiply(this.progress);
  this.position.add(this.fromStar.position);

  this.lastUpdateTime = Date.now();
}

Namespacer.addTo("Models", {
  Ship: Ship
});
