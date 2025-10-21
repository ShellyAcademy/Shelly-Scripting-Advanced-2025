let timerHandler = Timer.set(5000, true, function() {
    console.log("tick");
});

console.log("Timer Handler:", timerHandler);

Timer.set(2000, true, function() {
    let timerInfo = Timer.getInfo(timerHandler);
    if (timerInfo) {
        let remainingTime = timerInfo.next - Shelly.getUptimeMs();
        console.log("Remaining time of Timer:", remainingTime);
    }
});