let tempVcHandler = Virtual.getHandle("number:200");
let humidityVcHandler = Virtual.getHandle("number:201");

function logTempDataChange(data){
  console.log("New temp:", data.value);
}

function logHumDataChange(data){
  console.log("New humidity:", data.value);
}

tempVcHandler.on("change", logTempDataChange);
humidityVcHandler.on("change", logHumDataChange);