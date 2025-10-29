const VC_BUTTON = "button:200";
const buttonVC = Virtual.getHandle(VC_BUTTON);

buttonVC.on("single_push", function(result) {
  console.log("Button was pressed once");
});

buttonVC.on("double_push", function(result) {
  console.log("Button was pressed twice");
});