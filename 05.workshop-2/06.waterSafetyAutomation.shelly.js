let alarmVcHandler = Virtual.getHandle("boolean:200");

let timerHandler = undefined;
let periodOfTimeToOpenFullValveCapacity = 1000 * 30;

function changeValveState(position) {
    let URL = "http://192.168.10.187/rpc/Number.Set?id=200&value=" + position;
    Shelly.call("HTTP.GET", { url: URL });
}

function isFlooded() {
    return alarmVcHandler.getValue();
}

function openFullValveCapacity() {
    changeValveState(100);
    console.log("No floods are detected for last", (periodOfTimeToOpenFullValveCapacity / 1000), "seconds! The Valve full capacity is unlocked!");
}

alarmVcHandler.on("change", function (data) {
    if (data.value) {
        if (Timer.getInfo(timerHandler) === undefined) {
            console.log("Leak is detected and valve is turning off!");
        } else {
            Timer.clear(timerHandler);
            console.log("Leak is detected again and your valve is turned off! You need to press 'Reset swicth' to trigger the opening process!");
        }
        changeValveState(0);
    }
})

Shelly.addStatusHandler(function (data) {
    if (data.component == "input:0" && data.delta.state == true) {
        if (isFlooded()) {
            console.log("The reset switch is pressed, but the sensor is still NOT dry! Pleast try again later!");
        } else {
            if (Timer.getInfo(timerHandler) === undefined) {
                changeValveState(50);
                timerHandler = Timer.set(periodOfTimeToOpenFullValveCapacity, false, openFullValveCapacity);
                console.log("The turning on proccess begins!");
            } else {
                console.log("Another timer started!");
            }
        }
    }
})