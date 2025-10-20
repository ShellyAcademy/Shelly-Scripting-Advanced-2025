Shelly.addStatusHandler(function(statusData) {
  // console.log(JSON.stringify(statusData));
  if (statusData.component === "switch:0") {
    console.log(JSON.stringify(statusData));
    if (statusData.delta.output) {
      console.log("Switch is on, triggered source:", statusData.delta.source);
    } else {
      console.log("Switch is off, triggered source:", statusData.delta.source);
    }
  }
});