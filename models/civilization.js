function Civilization(stars, ships) {
  this.stars = stars || [];
  this.ships = ships || [];

  Aleph.Update.add(this);
}

Civilization.prototype.colonize = function(star) {
  star.civilization = this;
  this.stars.push(star);
}

Civilization.prototype.update = function() {}

Namespacer.addTo("Models", {
  Civilization: Civilization
});
