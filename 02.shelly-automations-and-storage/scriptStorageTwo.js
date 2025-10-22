let counter = Script.storage.getItem("counter");

if (typeof counter !== "string") {
  console.log("first time!");
  counter = 1;
} else {
  counter = Number(counter) + 1;
}

Script.storage.setItem("counter", String(counter));
console.log("Script was started", counter, "times");