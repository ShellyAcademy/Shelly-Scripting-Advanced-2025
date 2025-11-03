let humdityVcHandler = Virtual.getHandle("number:201");

function changeOutputStateByCriteria(ambientHum, humidityThreshold){
  Shelly.call("Switch.Set", {id:0, on: ambientHum > humidityThreshold})
}

humdityVcHandler.on("change", function(data){
    let humidity = data.value;
    let humidityTH = Shelly.getComponentStatus("input:100").percent;
    changeOutputStateByCriteria(humidity, humidityTH);
})

Shelly.addStatusHandler(function(data){
  if (data.component == "input:100"){
    let ambientHumidity = humdityVcHandler.getValue();
    changeOutputStateByCriteria(ambientHumidity, data.delta.percent);
  }
})