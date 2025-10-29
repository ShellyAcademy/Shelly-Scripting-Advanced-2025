const VC_TEMPERATURE = "number:200";
const temperatureVC = Virtual.getHandle(VC_TEMPERATURE);
let value = temperatureVC.getValue();
console.log("The value of temperature is:", value);

let newValue = 27;
temperatureVC.setValue(newValue);

console.log("New temperature after update:", temperatureVC.getValue());

let status = temperatureVC.getStatus();
console.log("Status:", status.value);