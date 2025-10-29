// Asynchronous way to extract data
Shelly.call("Boolean.GetStatus", {id: 250}, function(result) {
  // console.log(JSON.stringify(result));
  let value = result.value;
  console.log("Asynchronous value get status:", value);
});

// Synchronous way to extract data

let value = Shelly.getComponentStatus("boolean:250").value;
console.log("Synchronous value get status:", value);