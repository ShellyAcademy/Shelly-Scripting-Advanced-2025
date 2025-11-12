let CONFIG = {
    url: "http://clients3.google.com/generate_204",
    numberOfFails: 3,
    httpTimeout: 10,
    pingTimeInSeconds: 10
}

let failCounter = 0;
let pingTimer = undefined;

function actionToPerformWhenConnectionIsLost(){
    Shelly.call("Switch.Set", {id:0, on: false}, function(){
        console.log("Your device has been turned off at", Shelly.getComponentStatus("sys").time);
    })
}

function pingEndpoint(){
    let params = {
        url: CONFIG.url,
        timeout: CONFIG.httpTimeout
    };
    Shelly.call("HTTP.GET", params, function(response, error_code, error_message, user_data){
        if (error_code === -104 || error_code === -114){
            console.log("Failed to fetch", CONFIG.url);
            failCounter++;
        } else {
            failCounter = 0;
        }

        if (failCounter >= CONFIG.numberOfFails){
            console.log("Too many fails, turning off the consumer!");
            failCounter = 0;
            actionToPerformWhenConnectionIsLost();
            Timer.clear(pingTimer);
        }
    })
}

console.log("Internet connection watchdog is started!");
pingTimer = Timer.set(CONFIG.pingTimeInSeconds * 1000, true, pingEndpoint);

Shelly.addStatusHandler(function(statusData){
    if(statusData.component = "switch:0" && statusData.delta.hasOwnProperty("output")){
        pingTimer = Timer.set(CONFIG.pingTimeInSeconds * 1000, true, pingEndpoint);
    }
})