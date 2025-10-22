function getUrls(on) {
  urls = [
    "http://192.168.10.115/rpc/Switch.Set?id=0&on=" + on,
    "http://192.168.10.115/rpc/Switch.Set?id=1&on=" + on,
    "http://192.168.10.115/rpc/Switch.Set?id=2&on=" + on,
    "http://192.168.10.115/rpc/Switch.Set?id=3&on=" + on
  ];
  
  return urls;
}

Shelly.call("WebHook.Create", {
  enable: true,
  event: "switch.off",
  name: "turn_on_lights",
  urls: getUrls(false),
  cid: 0
})