const VC_TEMPERATURE = "number:202";
const brightnessVC = Virtual.getHandle(VC_TEMPERATURE);
let value = brightnessVC .getValue();
console.log("The value of temperature is:", value);

brightnessVC.on("change", function(result) {
  // console.log(JSON.stringify(result));
  let value = result.value;
  console.log("New value is:", value);
});