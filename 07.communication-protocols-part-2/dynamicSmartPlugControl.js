function shellyPlugSChangeLEDColor(red, green, blue, brightness) {
    let config = {
        "config": {
            "leds": {
                "colors": {
                    "switch:0":
                    {
                        "on": {
                            "rgb": [red, green, blue],
                            "brightness": brightness
                        }
                    }
                }
            }
        }
    };
    Shelly.call("PLUGS_UI.SetConfig", config);
}
function onButtonPress(button) {
    console.log("Button ", button, " pressed.");
    switch (button) {
        case 1: Shelly.call("Switch.toggle", { 'id': 0 });
            break;
        case 2: red = Math.round(Math.random() * 100);
            green = Math.round(Math.random() * 100);
            blue = Math.round(Math.random() * 100);
            brightness = Math.round(Math.random() * 100);
            shellyPlugSChangeLEDColor(red, green, blue, brightness);
            break;
    };
}

// onButtonPress(1);

Shelly.addEventHandler(function(eventData) {
  // console.log("Hello World!");
  // console.log(JSON.stringify(eventData));
  if (typeof eventData.component != "undefined" && 
  eventData.component === "script:4" &&
  eventData.info.event === "BLU_BUTTON") {
    console.log("Hello world!");
    console.log(JSON.stringify(eventData));
    let button = eventData.info.data.Button;
    onButtonPress(button);
  }
})