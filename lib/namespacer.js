Aleph = {};

Namespacer = {
  addTo: function(namespace, members) {
    var names = namespace.split("."),
        // defined in Namespacer constructor
        currentContext = Aleph;

    // Add namespaces if they don’t already exist
    _.each(names, function(name) {
      if (name.length === 0) {
        throw "Invalid namespace: " + namespace;
      }
      if (!currentContext[name]) {
        currentContext[name] = {};
      }
      currentContext = currentContext[name];
    });

    // Add members to namespace
    _.each(members, function(value, key) {
      currentContext[key] = value;
    });
  }
}
