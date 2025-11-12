let CONFIG = {
  SHELLY_1PM_MINI_DEVICE_ID: "shelly1pmminig4-ccba97c76884",
  SHELLY_1PM_DEVICE_ID: "shelly1pmg4-a085e3bb9f68",
  BLU_MOTION_ID: "bthomesensor:206",
  BLU_BUTTON_ID: "bthomedevice:201"
}

function emitDeviceEvent(dst){
  Shelly.emitEvent("TOGGLE", {dst: dst, id: 0});
}

Shelly.addEventHandler(function(eventData){
   if (eventData.component === CONFIG.BLU_BUTTON_ID && eventData.info.hasOwnProperty("event")){
     let eventType = eventData.info.event;
     if (eventType !== "long_push"){
       emitDeviceEvent(CONFIG.SHELLY_1PM_DEVICE_ID);
     } else {
       emitDeviceEvent(CONFIG.SHELLY_1PM_MINI_DEVICE_ID);
       emitDeviceEvent(CONFIG.SHELLY_1PM_DEVICE_ID);
     }
  }  
});

Shelly.addStatusHandler(function(event){
  if (event.component === CONFIG.BLU_MOTION_ID && event.delta.hasOwnProperty("value")){
    emitDeviceEvent(CONFIG.SHELLY_1PM_MINI_DEVICE_ID);
  }  
})