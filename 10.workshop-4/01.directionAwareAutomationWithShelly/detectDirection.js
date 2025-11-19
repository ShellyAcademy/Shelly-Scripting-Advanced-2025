let CONFIG = {
  BRIGHTNESS_LEVEL_WHEN_PEOPLE_AT_HOME: 80,
  BRIGHTNESS_LEVEL_WHEN_PEOPLE_ARE_NOT_AT_HOME: 0,
  MOTION_SENSOR_ID: "bthomesensor:202",
  DOOR_SENSOR_ID: "bthomesensor:205",
  QUIET_HOURS_START: 22,
  QUIET_HOURS_END: 7,
  TIME_DIFFERENCE_IN_SECONDS: 20,
  WELCOME_MESSAGES: ["Home sweet home!", "Welcome home!", "Arrival detected!"],
  BYE_MESSAGES: ["Have a great day!", "Exit Detected!", "Bye bye, see you soon!"],
  TTS_KEY: "TTS"
}

function changeBrightness(brightnessLevel){
  let payload = {
    id: 0,
    on: brightnessLevel > 0 ? true : false,
    brightness: brightnessLevel
  }
  
  Shelly.call("Light.Set", payload);
}

function isInNightTime(){
  let hour = parseInt(Shelly.getComponentStatus("sys").time.split(":")[0]);
  return hour >= CONFIG.QUIET_HOURS_START || hour <= CONFIG.QUIET_HOURS_END;
}

function getRandomMessage(collection){
  let idx = Math.floor(Math.random() * collection.length);
  return collection[idx];
}

Shelly.addStatusHandler(function(status){
  let currentSysTime = Shelly.getComponentStatus("sys").unixtime;
  
  if (status.component === CONFIG.MOTION_SENSOR_ID && status.delta.value === true){
    let lastDoorSensorChange = Shelly.getComponentStatus(CONFIG.DOOR_SENSOR_ID).last_updated_ts;
    
    if (currentSysTime - lastDoorSensorChange <= CONFIG.TIME_DIFFERENCE_IN_SECONDS){
      Shelly.emitEvent(CONFIG.TTS_KEY, {message: getRandomMessage(CONFIG.WELCOME_MESSAGES)})
      changeBrightness(100);
    } else {
      console.log("The motion sensor is trigged, without any other!");
    }
    
  } else if (status.component === CONFIG.DOOR_SENSOR_ID && status.delta.value === true) {
    let lastMotionChange = Shelly.getComponentStatus(CONFIG.MOTION_SENSOR_ID).last_updated_ts;
    
    if (currentSysTime - lastMotionChange <= CONFIG.TIME_DIFFERENCE_IN_SECONDS){
      Shelly.emitEvent(CONFIG.TTS_KEY, {message: getRandomMessage(CONFIG.BYE_MESSAGES)})
      changeBrightness(0);
    } else {
      console.log("The door sensor is trigged, without any other!");
    }
  }
})