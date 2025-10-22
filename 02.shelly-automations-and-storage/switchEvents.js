Shelly.addEventHandler(function(eventData) {
  if (typeof eventData.component != "undefined" && 
      eventData.component === "input:0") {
     console.log("Event:", JSON.stringify(eventData));
    // console.log("Hello from Shelly!");
  }
});