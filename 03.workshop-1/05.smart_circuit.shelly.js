let devices = [
    { name: "Shelly 1PM", ipAddr: "192.168.10.51", priority: 1, isOn: true },
    { name: "Shelly 1PM Mini Gen4 - 1", ipAddr: "192.168.10.52", priority: 2, isOn: true },
    { name: "Shelly 1PM Mini Gen4 - 2", ipAddr: "192.168.10.53", priority: 3, isOn: true }
]

let COMMAND = "/rpc/Switch.Set?id=0&on=";
const THRESHOLD_IN_AMPS = 0.200;
const SCRIPT_STORAGE_KEY = "devices";

function prepareHttpCallURL(ipAddr, operation) { return "http://" + ipAddr + COMMAND + operation;}

function getNextDeviceToTurnOff(devices) {
    let deviceToReturn = devices[0];

    for (let device of devices) {
        if (device.isOn && device.priority > deviceToReturn.priority) {
            deviceToReturn = device;
        }
    }

    return deviceToReturn;
}

function changeDeviceState(ipAddr, operation){ Shelly.call("HTTP.GET", {url: prepareHttpCallURL(ipAddr, operation)}); }

function updateDeviceStatus(devices, deviceToUpdate){
    for (let i = 0; i < devices.length; i++) {
        let currentDevice = devices[i];
        if (currentDevice.ipAddr === deviceToUpdate.ipAddr) { devices[i] = currentDevice }
    }

    Script.storage.setItem(SCRIPT_STORAGE_KEY, JSON.stringify(devices));
    console.log(deviceToUpdate.ipAddr, "device state is changed and saved", deviceToUpdate.isOn)
}

function restoreAllWorkingDevies(devices){
    for (const device of devices) {
        if (device.isOn) { changeDeviceState(device.ipAddr, device.isOn)}
    }
}

let savedData = Script.storage.getItem(SCRIPT_STORAGE_KEY);

if (typeof savedData !== 'string') {
    Script.storage.setItem(SCRIPT_STORAGE_KEY, JSON.stringify(devices));
    console.log("First init of script storage!");
} else {
    devices = JSON.parse(Script.storage.getItem(SCRIPT_STORAGE_KEY));   
}

restoreAllWorkingDevies(devices);

Shelly.addStatusHandler(function(data){
    if (data.name === "em1" && data.id === 0) {
        let usedEnergy = data.delta.current;
        console.log("Used energy is", usedEnergy, "with TH", THRESHOLD_IN_AMPS);
        if (usedEnergy > THRESHOLD_IN_AMPS) {
            let nextDeviceToTurnOff = getNextDeviceToTurnOff(devices);
            changeDeviceState(nextDeviceToTurnOff.ipAddr, false);
            nextDeviceToTurnOff.isOn = false;
            updateDeviceStatus(devices, nextDeviceToTurnOff);
        }
        
    }
})