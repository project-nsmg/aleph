function Star(id, position) {
  var self = this;

  self.id = id;
  self.position = position;
  self.connectedStars = [];
}

Namespacer.addTo("Models", {
  Star: Star
});
