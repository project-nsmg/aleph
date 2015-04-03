function Civilization(stars, ships) {
  this.stars = stars || [];
  this.ships = ships || [];

  Aleph.Update.add(this);
}

Civilization.prototype.update = function() {
  var indexToRemove = [];
  for (var i = 0; i < this.ships.length; i++) {
    if (this.ships[i].progress === 1) {
      this.ships[i].toStar.civilization = this;
      this.ships[i].toStar.population = 1;
      Aleph.Update.remove(this.ships[i]);
      indexToRemove.push(i);
    }
  }
  for (var i = 0; i < indexToRemove.length; i++) {
    this.ships.slice(indexToRemove[i], 1);
  }
}

Namespacer.addTo("Models", {
  Civilization: Civilization
});
