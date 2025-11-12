MQTT.subscribe("living_room/#", function(topic, message) {
  let payload = JSON.parse(message);
  let path = topic.split("/");
  if (path[1] === "temperature"){
    console.log("The temperature =", payload.temperature);
  } else if (path[1] === "humidity"){
    console.log("The humidity =", payload.temperature);
  }
});