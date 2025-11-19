let CONFIG = {
  ALLOWED_PEOPLE_COUNT: 3,
  QUIET_HOUR_START: 22,
  QUIET_HOUR_END: 7
}

function sendNotification(title, message) {
  const url = "https://alertzy.app/send";
  let data = {
    accountKey: "6sj2uj3l5veahis",
    title: title,
    message: message,
    priority: 2,
    group: "Security",
    image: "https://cdn-icons-png.flaticon.com/512/564/564619.png"
  };

  Shelly.call("HTTP.POST", { url: url, body: JSON.stringify(data) }, function (result, errorCode, errorMessage) {
    if (errorCode === 0) {
      let body = JSON.parse(result.body);
      if (body === "success") {
        console.log("Notification sent");
      }
    }
  })
}

Shelly.addEventHandler(function (event) {
  if (event.component === "presencezone:201" && event.info.hasOwnProperty("num_objects")) {
    let peopleCountInZone = event.info.num_objects;
    if (CONFIG.ALLOWED_PEOPLE_COUNT > peopleCountInZone) {
      let currentTime = Shelly.getComponentStatus("sys").time;
      let hour = parseInt(currentTime.split(":")[0]);
      if (hour >= CONFIG.QUIET_HOUR_START || hour <= CONFIG.QUIET_HOUR_END) {
        sendNotification("People Count Exceeded Threshold!", "Pleaple count is 5, but threshold is 3");
      }
    }
  }
});