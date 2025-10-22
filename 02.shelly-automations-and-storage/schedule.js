scheduleParams = {
  "enable": true,
  "timespec": "0 31 20 * * *",
  "calls": [{
    "method": "Switch.Toggle",
    "params": {
      "id": 0
    }
  }]
};

Shelly.call("Schedule.Create", scheduleParams, function(result) {
  console.log(result);
});