function getTemperature() {
  let url =
    "https://api.open-meteo.com/v1/forecast?latitude=42.13&longitude=24.74&current=temperature_2m";
  Shelly.call("HTTP.GET", { url: url }, function (result) {
    let response = JSON.parse(result.body);
    let temperature = response.current.temperature_2m;
    console.log("The current temperature is:", temperature);
  });
}

Shelly.call(
  "Schedule.Create",
  {
    enable: true, // Enable this schedule
    timespec: "0 53 20 * * *", // Every two hours
    calls: [
      {
        method: "script.eval",
        params: {
          id: Shelly.getCurrentScriptId(),
          code: "getTemperature()",
        },
      },
    ],
  },
  function (result) {
    //save a record that we are registered
    console.log("Script starting", result);
  }
);