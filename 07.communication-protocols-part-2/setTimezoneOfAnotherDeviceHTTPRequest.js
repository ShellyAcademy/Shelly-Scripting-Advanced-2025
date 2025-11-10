let myUrl = "http://192.168.10.118/rpc/Sys.SetConfig";
let myBody = {
  "config": {
    "timezone": {
      "tz": "Europe/Sofia"
    }
  }
};

Shelly.call("HTTP.Request", {method: "POST", url: myUrl, body: myBody}, function(result, errorCode, errorMessage) {
  console.log("Error code:", errorCode);
  console.log("Error Message:", errorMessage);
  console.log("Response:", JSON.stringify(result));
  
  // This is wrong
  // let restartRequired = result.restart_required;
  
  let body = JSON.parse(result.body);
  let restartRequired = body.restart_required;
  console.log("Restart required:", restartRequired);
});