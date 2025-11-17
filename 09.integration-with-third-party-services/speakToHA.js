const TEXT_VC_ID = 200;
const SPEAK_VC_ID = 200;

let textToSpeak = "Hello from a Shelly script!";

Shelly.call("Text.Set", {
  id: TEXT_VC_ID,
  value: textToSpeak
}, function() {
  Shelly.call("Button.trigger", {id: SPEAK_VC_ID, event: "single_push"});
});