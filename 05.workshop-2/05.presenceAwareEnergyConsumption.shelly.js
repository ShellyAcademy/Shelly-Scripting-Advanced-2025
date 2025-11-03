let peopleCountVcHandler = Virtual.getHandle("number:203");

let timerHandler = undefined;

let timerPeriod = 1000 * 10;

function turnOffTheOutput(){
  Shelly.call("Switch.Set", {id:0, on:false});
  console.log("Don't detect any people in last", (timerPeriod / 1000), "seconds and turned the output off!");
}

Shelly.addStatusHandler(function(data){
  if (data.component === "switch:0" && data.delta.hasOwnProperty("apower")) {
      let energyConsumption = data.delta.apower;
      if (energyConsumption > 0 && peopleCountVcHandler.getValue() == 0) {
        console.log("The device consumes energy but there is no one around!");
        if (Timer.getInfo(timerHandler) !== undefined) {
           console.log("There is an active timer! Not started new one! Current Timer will finish in", JSON.stringify(Timer.getInfo(timerHandler)));
        } else {
           timerHandler = Timer.set(timerPeriod, false, turnOffTheOutput);
           console.log("Started timer!");
        }
      }
  }
})

peopleCountVcHandler.on("change", function(data){
  let peopleCount = data.value;
  if (peopleCount > 0 && Timer.getInfo(timerHandler) !== undefined){
     Timer.clear(timerHandler);
     console.log("Detected", peopleCount, "and removed the timer!");
  }  
})