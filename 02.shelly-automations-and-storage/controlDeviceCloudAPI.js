const deviceId = "";
const serverUrl = "";
const authKey = "";

const url = serverUrl + "/v2/devices/api/set/switch?auth_key=" + authKey;

console.log(url);

const requestContent = JSON.stringify({
    id: deviceId,
    channel: 0,
    on: true
});

Shelly.call(
    "HTTP.Request",
    {
        url: url,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestContent
    },
    function (result, errorCode, errorMsg) {
        console.log(result);
    }
)