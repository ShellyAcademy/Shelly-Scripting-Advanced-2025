const VC_TEMPERATURE = "number:200";
const VC_HUMIDITY = "number:201";

const TEMPERATURE_THRESHOLD = 30;
const HUMIDITY_THRESHOLD = 50;

const temperatureVC = Virtual.getHandle(VC_TEMPERATURE);
const humidityVC = Virtual.getHandle(VC_HUMIDITY);

let heaterOn = false;
let fanOn = false;

temperatureVC.on("change", function(event) {
  let temperature = event.value;
  console.log(temperature);
  if (temperature <= TEMPERATURE_THRESHOLD) {
    if(!heaterOn) {
      console.log("Turning heater on");
      Shelly.call("Switch.Set", {id: 0, on: true});
      heaterOn = true;
    } else if (heaterOn) {
      console.log("Turning heater off");
      Shelly.call("Switch.Set", {id: 0, on: false});
      heaterOn = false;
    }
  }
});

humidityVC.on("change", function(event) {
  let humidity = event.value;
  if (humidity > HUMIDITY_THRESHOLD) {
    if(!fanOn) {
      Shelly.call("Switch.Set", {id: 0, on: true});
      fanOn = true;
    } else if (fanOn) {
      Shelly.call("Switch.Set", {id: 0, on: false});
      fanOn = false;
    }
  }
});