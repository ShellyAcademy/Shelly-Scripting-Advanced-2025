let CONFIG = {
  CONFIRM_NOT_SLEEP_PERIOD_IN_MINUTES: 60,
  TIME_TO_RESPOND_IN_MINUTES: 5,
  MOTION_SENSOR_ID: "bthomesensor:202",
  PLAY_SOUND_EVENT_NAME: "TTS",
  CHANGE_TV_STATE_EVENT_NAME: "TV"
}

let timerCheckIsSleeping = undefined;
let timerResponseForNotSleeping = undefined;

timerCheckIsSleeping = Timer.set(1000 * 60 * CONFIG.CONFIRM_NOT_SLEEP_PERIOD_IN_MINUTES, true, function(){
    Shelly.emitEvent(CONFIG.PLAY_SOUND_EVENT_NAME, {message: "Are you still watching TV? Please make a move to tell us!"});
    
    timerResponseForNotSleeping = Timer.set(1000 * 60 * CONFIG.TIME_TO_RESPOND_IN_MINUTES, false, function(){
      let message = "No movements are registered for last " + CONFIG.TIME_TO_RESPOND_IN_MINUTES + "minutes! Turning off the TV!";
      Shelly.emitEvent(CONFIG.PLAY_SOUND_EVENT_NAME, {message: message});
      Shelly.emitEvent(CONFIG.CHANGE_TV_STATE_EVENT_NAME, {message: "off"});
      Timer.clear(timerCheckIsSleeping);
    })
})

Shelly.addStatusHandler(function(status){
  if (status.component === CONFIG.MOTION_SENSOR_ID && status.delta.value === true && timerResponseForNotSleeping != undefined){
    let message = "Movement is registered! Happy watching!";
    Shelly.emitEvent(CONFIG.PLAY_SOUND_EVENT_NAME, {message: message});
    Timer.clear(timerResponseForNotSleeping );
   } 
})