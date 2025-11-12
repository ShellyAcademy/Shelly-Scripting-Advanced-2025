function callTheCoverAtHome() {
    Shelly.call("KVS.Get", { key: "cloud-api-key" }, function (kvsData) {
        let apiKey = kvsData.value;
        let postRequestPayload = {
            url: "https://shelly-97-eu.shelly.cloud/v2/devices/api/set/cover?auth_key=" + apiKey,
            body: {
                "id": "8cbfea94f954",
                "channel": 0,
                "position": "open"
            }
        }
    })
}

Shelly.addEventHandler(function (evData) {
    if (evData.component === "bthomedevice:200" && evData.info.hasOwnProperty("event") && evData.info.event === "long_push") {
        console.log("send data");
    }
})