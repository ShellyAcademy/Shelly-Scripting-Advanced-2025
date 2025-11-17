const UPDATE_PERIOD_THRESHOLD = 1000;

const baseUrl = "http://192.168.10.119:8080/switch";
const deviceInfo = Shelly.getDeviceInfo();
const deviceId = deviceInfo.id;

function updateSwitch(switchId, output, voltage, apower) {
  let data = {
    device_id: deviceId,
    switch_id: switchId,
    output: output,
    voltage: voltage,
    apower: apower
  }
  
  let request = {
    url: baseUrl + "/" + data.device_id + "/"  + data.switch_id,
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };
  Shelly.call("HTTP.Request", request, function(response, errorCode, errorMessage) {
    if (errorCode === 0) {
      console.log("Success:", response.body);
    } else {
      console.log("Error:", errorMessage);
    }
  });
}

let lastUpdateTimestamp = Date.now() - UPDATE_PERIOD_THRESHOLD;

Shelly.addStatusHandler(function(statusData) {
  if (statusData.component.substr(0, 6) === "switch") {
    let tsNow = Date.now();
    if (tsNow - lastUpdateTimestamp > UPDATE_PERIOD_THRESHOLD) {
      lastUpdateTimestamp = tsNow;
      
      let switchStatus = Shelly.getComponentStatus(statusData.component);
      console.log("New status update for:", statusData.component);
      updateSwitch(switchStatus.id, switchStatus.output, switchStatus.voltage, switchStatus.apower);
    }
  }
})