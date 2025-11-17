const MOTION_COMPONENT = "bthomesensor:202";

function sendNotification(title, message) {
  const url = "https://alertzy.app/send";
  let data = {
    "accountKey": "",
    "title": title,
    "message": message
  };
  
  Shelly.call("HTTP.POST", {url: url, body: JSON.stringify(data)}, function(result, errorCode, errorMessage) {
    if (errorCode === 0) {
      let body = JSON.parse(result.body);
      if (body === "success") {
        console.log("Notification sent");
      }
    }
  })
}

Shelly.addStatusHandler(function(statusData) {
  if (statusData.component === MOTION_COMPONENT && typeof statusData.delta.value != "undefined") {
    let motion = statusData.delta.value;
    console.log(motion);
    if (motion) {
      sendNotification("Motion detected", "Motion is detected in the living room.");
    } else {
      sendNotification("Motion detected", "No motion any more!");
    }
  }
});