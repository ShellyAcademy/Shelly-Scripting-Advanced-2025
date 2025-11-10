let url = "http://192.168.10.245:8080/test.html";

Shelly.call("HTTP.GET", {url: url, timeout: 5}, function(response, errorCode, errorMessage) {
  console.log("Error code:", errorCode);
  console.log("Error Message:", errorMessage);
  console.log("Response:", JSON.stringify(response));
  
  console.log("There was an error:", errorCode !== 0 || response.code !== 200);
});