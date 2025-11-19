let CONFIG = {
  BRIGHTNESS_LEVEL_WHEN_PEOPLE_AT_HOME: 80,
  BRIGHTNESS_LEVEL_WHEN_PEOPLE_NOT_AT_HOME: 0,
  PLAY_SOUND_EVENT_NAME: "TTS",
  MOTION_SENSOR_ID: "bthomesensor:205",
  DOOR_SENSOR_ID: "bthomesensor:202",
  TIME_DIFFERENCE_IN_SECONDS: 60,
  WELCOME_MESSAGES: [
    "Welcome back. Illumination sequence initiated.",
    "Arrival detected. Engaging lighting presets.",
    "Access granted. Lights activating now.",
    "Visual ambience restored to occupancy levels.",
    "Presence confirmed. Main lighting engaged."
  ],
  GOODBYE_MESSAGES: [
    "Departure confirmed. Deactivating illumination.",
    "Premises vacated. Lights powering down.",
    "Exit detected. Switching to off state.",
    "Occupancy ended. Lighting disabled.",
    "Zone clear. Turning off all lights."
  ]
};

function changeBrightness(brigtnessLevel){
  let payload = {
    id: 0,
    on: brightnessLevel > 0 ? true : false,
    brightness: brightnessLevel 
  }
  Shelly.call("Light.Set", payload);
}

function getRandomMessage(collection) {
  let index = Math.floor(Math.random() * collection.length);
  return collection[index];
}

Shelly.addStatusHandler(function(status){
  let currentTimeInUnix = Shelly.getComponentStatus("sys").unixtime;
  
  if (status.component === CONFIG.MOTION_SENSOR_ID && status.delta.value === true){
    let doorStatusLastChange = Shelly.getComponentStatus(CONFIG.DOOR_SENSOR_ID).last_updated_ts;
    
    if (currentTimeInUnix - doorStatusLastChange <= CONFIG.TIME_DIFFERENCE_IN_SECONDS){
      Shelly.emitEvent(CONFIG.PLAY_SOUND_EVENT_NAME, {"message": getRandomMessage(CONFIG.WELCOME_MESSAGES)});
      changeBrightness(CONFIG.BRIGHTNESS_LEVEL_WHEN_PEOPLE_AT_HOME);
    } else {
      console.log("Just motion sensor is triggered!");
    }
    
  } else if (status.component === CONFIG.DOOR_SENSOR_ID && status.delta.value === true) {
    let motionLastChange = Shelly.getComponentStatus(CONFIG.MOTION_SENSOR_ID).last_updated_ts;
    
    if (currentTimeInUnix - motionLastChange <= CONFIG.TIME_DIFFERENCE_IN_SECONDS){
       Shelly.emitEvent(CONFIG.PLAY_SOUND_EVENT_NAME, {"message": getRandomMessage(CONFIG.GOODBYE_MESSAGES)});
       changeBrightness(CONFIG.BRIGHTNESS_LEVEL_WHEN_PEOPLE_NOT_AT_HOME);
    } else {
      console.log("Just door sensor is triggered!");
    }
  }
})