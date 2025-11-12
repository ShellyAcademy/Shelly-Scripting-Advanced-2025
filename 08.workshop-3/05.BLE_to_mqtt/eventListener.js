MQTT.subscribe("/myhome/lamp", function(topic, message) {
   let payload = JSON.parse(message).message;
   Shelly.call("Switch.Set", {id:0, on: payload});
});