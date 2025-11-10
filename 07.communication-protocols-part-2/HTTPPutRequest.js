let url = "https://reqbin.com/echo/put/json";

let requestData = {
  lat: 42,
  lon: 24,
  query: "temperature"
};

Shelly.call("HTTP.Request", {method: "PUT", url: url, body: requestData}, function(result, errorCode, errorMessage) {
  console.log(result);
});