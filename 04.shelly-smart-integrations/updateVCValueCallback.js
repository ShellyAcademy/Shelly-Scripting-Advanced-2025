
let newValue = true;

Shelly.call("Boolean.Set", {id: 250, value: newValue}, function(result) {
  console.log("Boolean value was changed!");
  console.log(Shelly.getComponentStatus("boolean:250"));
});

// console.log(Shelly.getComponentStatus("boolean:250"));