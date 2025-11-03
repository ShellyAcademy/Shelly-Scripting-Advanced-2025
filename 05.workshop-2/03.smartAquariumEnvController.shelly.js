let CONSTANTS = {
  targetWaterTemperature: 25,
  minRoomTemperature: 18,
  maxRoomTemperature: 28,
  ambientTemperatureSensorId: "number:200",
  waterTemperatureSensorId: "temperature:100"
}

function changeHeaterState(state){
  Shelly.call("Switch.Set", {id:0, on: state}, function(result, error_code){
    if (error_code === 0 && result.was_on !== state){
      console.log(state ? "Heater has been turned on!" : "Heater has been turned off!");
    }
  })
}

function controllEnvironment(waterTemperature, ambientTemperature){
   let shouldHeatWater = waterTemperature < CONSTANTS.targetWaterTemperature;
   changeHeaterState(shouldHeatWater);
   
   if (ambientTemperature < CONSTANTS.minRoomTemperature){
     console.log("WARNING: Room too cold!");
   } else if (ambientTemperature > CONSTANTS.maxRoomTemperature) {
     console.log("ALERT: Room too hot");
   }
}

Shelly.addStatusHandler(function(event){
  if (event.component === CONSTANTS.waterTemperatureSensorId){
     let ambientTemperature = Shelly.getComponentStatus(CONSTANTS.ambientTemperatureSensorId).value;
     controllEnvironment(event.delta.tC, ambientTemperature);
  } else if (event.component === CONSTANTS.ambientTemperatureSensorId){
    let waterTemperature = Shelly.getComponentStatus(CONSTANTS.waterTemperatureSensorId).tC;
    controllEnvironment(waterTemperature, event.delta.value);
  }
})