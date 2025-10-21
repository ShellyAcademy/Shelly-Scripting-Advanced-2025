let timerHandler = -1;
Shelly.addEventHandler(function (eventData) {
    if (eventData.component != "undefined" &&
        eventData.component === "switch:0" &&
        eventData.info.event === "toggle" &&
        eventData.info.state === true) {
        console.log("Switch was turned on. It will be turned off after one hour.");
        // Check if there is an already created timer, avoid blocking the device
        if (timerHandler != -1) {
            Timer.clear(timerHandler);
        }
        timerHandler = Timer.set(10000, false, function () {
            console.log("1 hour passed, turning off the switch.");
            Shelly.call("Switch.Set", { id: 0, on: false });
            timerHandler = -1;
        })
    }
});