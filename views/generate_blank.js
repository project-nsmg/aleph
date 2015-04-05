function generateBlankGenerator() {
  return function() {
    return {
      position: new Aleph.Helpers.Vector3(0, 0, 0)
    }
  }
}

Namespacer.addTo("Views", {
  generateBlankGenerator: generateBlankGenerator
});
