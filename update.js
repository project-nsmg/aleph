var updateObjs = [];

function act() {
  _.each(updateObjs, function(obj) {
    obj.update();
  });
}

function add(obj) {
  updateObjs.push(obj);
}

function remove(obj) {
  var index = updateObjs.indexOf(obj);
  if (index > -1) {
    updateObjs.slice(index, 1);
  }
}

Namespacer.addTo("Update", {
  act: act,
  add: add,
  remove: remove
});
