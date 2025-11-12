let topic = "/myhome/lamp";
let message = null;
let bluMontionId = "bthomesensor:206";
let bluButtonId = "bthomedevice:201";

function publishToMQTT(boolean){
  message = JSON.stringify({message: boolean});
  let result = MQTT.publish(topic, message);
  console.log("MQTT Result", result);
  
  if (result) {
    console.log("Message published successfully!");
  } else {
    console.log("Message NOT published!");
  }
}

function handleStatus(){
  Shelly.call("Switch.Toggle", {id: 0});
  let output = Shelly.getComponentStatus("switch:0").output;
  publishToMQTT(!output);
}

Shelly.addEventHandler(function(event){
  if (event.component === bluButtonId && event.info.hasOwnProperty("event")){
    handleStatus();
  }  
});

Shelly.addStatusHandler(function(event){
  if (event.component === bluMontionId && event.delta.hasOwnProperty("value")){
    handleStatus();
  }  
})