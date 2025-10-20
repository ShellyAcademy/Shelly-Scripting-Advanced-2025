const TIME_TO_REPEAT_COUNTER = 2;
let timerCounter = 0;
let timerHandler = Timer.set(3000, true, function() {
  console.log("tick");
  timerCounter++;
  if (timerCounter === TIME_TO_REPEAT_COUNTER) {
    Timer.clear(timerHandler);
    console.log("Stopping timer...");
  }
});