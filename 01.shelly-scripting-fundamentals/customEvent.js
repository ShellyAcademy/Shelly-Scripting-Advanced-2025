Shelly.emitEvent("this_happened", {"what": "when", "why": 42});

// Another script
Shelly.addEventHandler(function(eventData) {
  // console.log(JSON.stringify(eventData));
  if (eventData.component != "undefined" &&
      eventData.component === "script:4" &&
      eventData.info.event === "this_happened") {
        console.log(JSON.stringify(eventData));
      }
});