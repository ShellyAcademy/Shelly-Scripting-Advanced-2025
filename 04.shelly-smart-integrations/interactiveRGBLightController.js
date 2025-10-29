const TIMER_INTERVAL = 1000;
const DIMMING_TIMER_INTERVAL = 10000;

let timerHandler = null;
let dimmingTimerHandler = null;

function startRandomLights() {
  if (Timer.getInfo(timerHandler) !== undefined) {
    console.log("Already running timer. Cleaning timer handler.");
    Timer.clear(timerHandler);
    return;
  }
  
  timerHandler = Timer.set(TIMER_INTERVAL, true, function() {
    let red = Math.round(Math.random() * 255);
    let green = Math.round(Math.random() * 255);
    let blue = Math.round(Math.random() * 255);
    console.log("Red", red);
    console.log("Green", green);
    console.log("Blue", blue);
    Shelly.call("RGB.Set", {id: 0, rgb: [red, green, blue]});
  });
}

function stopLights() {
  if (Timer.getInfo(timerHandler) !== undefined) {
    Timer.clear(timerHandler);
    timerHandler = null;
  }
}

function startDimming() {
  if (Timer.getInfo(dimmingTimerHandler) !== undefined) {
    return;
  }
  
  let ud = {dimmingUp: true};
  dimmingTimerHandler = Timer.set(
    DIMMING_TIMER_INTERVAL,
    true,
    function (ud) {
      if (ud.dimmingUp) {
        console.log("Dimming Up.");
        Shelly.call("RGB.DimUp", {id: 0});
      } else {
        console.log("Dimming Down.");
        Shelly.call("RGB.DimDown", {id: 0});
      }
      ud.dimmingUp = !ud.dimmingUp;
    },
    ud
  );
}

Shelly.addEventHandler(function(eventData) {
  if (typeof eventData.component != "undefined") {
    let component = eventData.component;
    let event = eventData.info.event;
    if (component === "input:0" && event === "single_push") {
      console.log(JSON.stringify(eventData));
      // Toggle the RGB Component
       Shelly.call("RGB.Toggle", {id: 0});
    } else if (component === "input:1" && event === "single_push") {
      console.log(JSON.stringify(eventData));
      // Start Random lights
      // startRandomLights();
    } else if (component === "input:1" && event === "double_push") {
      console.log(JSON.stringify(eventData));
      // Stop Lights
      stopLights();
    } else if (component === "input:2" && event === "single_push") {
      console.log(JSON.stringify(eventData));
      // Start Auto dimming
      startDimming();
    }
  }
})