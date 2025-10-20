function eventHandler(eventData, userData) {
  // console.log(JSON.stringify(eventData));
  // console.log(eventData);
  // console.log(JSON.stringify(userData));
  if (eventData.component != "undefined" &&
      eventData.component === "switch:1" && 
      eventData.info.event === "toggle"
  ) {
    console.log(JSON.stringify(eventData));
    
    if (eventData.info.state === true) {
      console.log("Switch is on.");
    } else {
      console.log("Switch is off");
    }
  }
}

Shelly.addEventHandler(eventHandler, {info: "Event information - user data"});