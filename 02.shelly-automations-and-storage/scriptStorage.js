let counter = Script.storage.getItem("counter");

if (typeof counter !== "string") {
  console.log("first time!");
  counter = 1;
} else {
  counter = JSON.parse(counter) + 1;
}

Script.storage.setItem("counter", JSON.stringify(counter));
console.log("Script was started", counter, "times");