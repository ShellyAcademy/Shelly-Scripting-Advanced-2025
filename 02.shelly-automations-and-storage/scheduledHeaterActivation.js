Shelly.call("Schedule.Create", {
    "enable": true, // Enable this schedule
    "timespec": "10 59 20 * * *", // At 17:30 every day
    "calls": [
        {
            "method": "Switch.Set", // Controlling a switch for the boiler
            "params": { "id": 0, "on": true } // Turn on the boiler (switch with id=0)
        }
    ]
}, function (result) {
    console.log("Boiler activation schedule set:", result);
});

Shelly.addEventHandler(function (eventData) {
    if (typeof eventData.component != "undefined" &&
        eventData.component === "switch:0" &&
        eventData.info.state === true) {
        Timer.set(10000, false, function () {
            Shelly.call("Switch.Set", { id: 0, on: false });
        })
    }
});