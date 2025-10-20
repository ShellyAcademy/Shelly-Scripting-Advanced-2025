let device = "Shelly Pro";
let deviceArray = device.split("");
console.log(deviceArray);
let deviceLength = deviceArray.length;
let stack = [];

for (let i = 0; i < deviceLength; i++) {
  stack.push(deviceArray.pop());
}

console.log(stack.join(""));