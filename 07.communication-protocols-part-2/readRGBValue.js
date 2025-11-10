Shelly.addStatusHandler(function(statusData) {
  if (statusData.name != "undefined" && statusData.name === "text") {
    let value = statusData.delta.value;
    let data = JSON.parse(value);
    
    if (typeof data.component != "undefined" && data.component == "rgb:0") {
      let brightness = data.delta.brightness;
      let rgb = data.delta.rgb;
      
      console.log("Setting brightness to:", brightness);
      
      let ledconfig = {
        config: {
          leds: {
            colors: {
              "switch:0": {
                on: {
                  brightness: brightness,
                  rgb: [
                    Math.round(rgb[0] / 2.55),
                    Math.round(rgb[1] / 2.55),
                    Math.round(rgb[2] / 2.55),
                  ],
                },
              },
            },
          },
        },
      };
      Shelly.call("PLUGS_UI.SetConfig", ledconfig);
    }
  }
});