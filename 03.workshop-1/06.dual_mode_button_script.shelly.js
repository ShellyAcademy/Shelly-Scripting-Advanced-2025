let supportedEvents = ["single_push", "double_push", "triple_push", "long_push"]
const ipAddress = "192.168.10.230";

let cipher = [supportedEvents[0], supportedEvents[3], supportedEvents[1]];
let userInput = [];

function changeDeviceState(ipAddr, operation){
    let URL = "http://" + ipAddr + "/rpc/Switch.Set?id=0&on=" + operation;
    Shelly.call("HTTP.GET", {url: URL});
}

function turnOffDevice(data){
    changeDeviceState(data.ipAddr, false);
}

timerHandler = null;

function handleEvents(event){
  userInput.push(event);
  let idx = userInput.length - 1;
  if (userInput[idx] === cipher[idx]){
    console.log("you are going well");
  } else {
    userInput.splice();
    console.log("Try again!");
  }
  
  if (userInput.length === cipher.length){
    console.log("UNLOCKED");
    Timer.clear(timerHandler);
  }
}

Shelly.addEventHandler(function(data){
    if (data.name === "input" && supportedEvents.indexOf(data.info.event) >= 0) {
        if (Timer.getInfo(timerHandler) == null) {
            changeDeviceState(ipAddress, true);
            timerHandler = Timer.set(1000 * 10, false, turnOffDevice, {ipAddr: ipAddress})
        }
        handleEvents(data.info.event);
    }
})