let newValue = false;

Shelly.call("Boolean.Set", {id: 250, value: newValue});

console.log(Shelly.getComponentStatus("boolean:250"));