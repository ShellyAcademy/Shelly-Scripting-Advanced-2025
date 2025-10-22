urls = ['http://192.168.10.115/rpc/Number.Set?id=200&value=${status["input:100"].percent}'];

Shelly.call("WebHook.Create", {
    enable: true,
    event: "input.analog_change",
    name: "analog_measure_sync",
    urls: urls,
    cid: 100
});