HTTPServer.registerEndpoint("my_custom_endpoint", function(request, response) {
  console.log(JSON.stringify(request));
  
  response.code = 200;
  // response.body = "Successfully Toggled the plug!";
  // response.headers = [["Content-Type", "text/plain"]];
  
  response.body = JSON.stringify({
    "result": "success"
  });
  
  // Wrong, do not send the object
  // response.body = {
    // "result": "success"
  // };
  response.headers = [["Content-Type", "application/json"]];
  Shelly.call("Switch.Toggle", {id: 0});
  response.send();
});