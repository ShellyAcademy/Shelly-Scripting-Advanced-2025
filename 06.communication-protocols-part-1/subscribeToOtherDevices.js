const EVENTS_TOPIC = "shellyprorgbwwpm-ac1518784c54/events/rpc";

function handleEvents(topicName, message) {
  let event = JSON.parse(message);
  // console.log(events);
  if (event.method === "NotifyEvent") {
    for (e of event.params.events) {
      console.log(e.event);
      console.log(e.component);
      if (e.component === "input:2" && e.event === "btn_down") {
        console.log("Button pressed, toggling the switch");
        Shelly.call("Switch.Toggle", {id: 0});
      }
    }
  }
}

MQTT.subscribe(EVENTS_TOPIC, handleEvents);