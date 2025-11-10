const doorSensorOpenBT = "bthomesensor:203";
const doorSensorIlluminanceBT = "bthomesensor:202";
const doorSensorRotationBT = "bthomesensor:204";

Shelly.addStatusHandler(function(eventData) {
  if (typeof eventData.component != "undefined" &&
   eventData.component == doorSensorOpenBT) {
    let isDoorOpen = eventData.delta.value;
    console.log("Door open:", isDoorOpen);
    if (isDoorOpen) {
      let illuminance = Shelly.getComponentStatus(doorSensorIlluminanceBT).value;
      let rotation = Shelly.getComponentStatus(doorSensorRotationBT).value;
      console.log("Door was open.");
      console.log("Illuminance is:", illuminance);
      console.log("Rotation is:", rotation);
    }
   }
});