let urls = [
  "http://192.168.10.230/rpc/Shelly.GetDeviceInfo",
  "http://192.168.10.185/rpc/Shelly.GetDeviceInfo",
  "http://192.168.10.200/rpc/Shelly.GetDeviceInfo",
  "http://192.168.10.230/rpc/Shelly.GetDeviceInfo",
  "http://192.168.10.147/rpc/Shelly.GetDeviceInfo",
  "http://192.168.10.230/rpc/Shelly.GetDeviceInfo",
  "http://192.168.10.185/rpc/Shelly.GetDeviceInfo",
  "http://192.168.10.200/rpc/Shelly.GetDeviceInfo",
  "http://192.168.10.230/rpc/Shelly.GetDeviceInfo",
  "http://192.168.10.147/rpc/Shelly.GetDeviceInfo"
];

for (let url of urls) {
  Shelly.call("HTTP.Get", {url: url}, function(result, errorCode, errorMessage) {
    if (errorCode === 0) {
      console.log("Request successfully sent.");
    } else {
      console.log("Error:", errorMessage);
    }
  });
}