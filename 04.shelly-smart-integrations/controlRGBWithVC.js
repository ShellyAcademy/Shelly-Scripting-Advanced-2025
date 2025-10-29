const VC_LIGHTS_CONTROL = "boolean:250";
const VC_BRIGHTNESS = "number:202";

const lightsControlVC = Virtual.getHandle(VC_LIGHTS_CONTROL);
const brightnessVC = Virtual.getHandle(VC_BRIGHTNESS);

let baseUrl = "http://192.168.10.185/rpc/RGB.Set?id=0";
lightsControlVC.on("change", function(eventData) {
  let value = eventData.value;
  let onoff;
  if (value) {
    onoff = "true";
  } else {
    onoff = "false";
  }
  let url = baseUrl + "&on=" + onoff;
  console.log(url);
  Shelly.call("HTTP.Get", {url: url});
});

brightnessVC.on("change", function(eventData) {
  let value = eventData.value;
  let url = baseUrl + "&brightness=" + value;
  Shelly.call("HTTP.Get", {url: url});

});