const TEMPERATURE_VC = "number:200"
let temperatureVC = Virtual.getHandle(TEMPERATURE_VC);

Shelly.addEventHandler(function(eventData) {
  if (typeof eventData.component != "undefined" &&
  eventData.component === "temperature:100") {
    console.log(JSON.stringify(eventData));
    let temperatureSensorValue = eventData.info.tC;
    console.log(temperatureSensorValue);
    temperatureVC.setValue(temperatureSensorValue);
  }
});