function sendTemperatureData(data){
  MQTT.publish("living_room/temperature", JSON.stringify({temperature: data}));
  MQTT.publish("living_room/humidity", JSON.stringify({temperature: data - 1})); // the data is mocked and shown as a demo
}


function parseQueryParams(queryString){
  let queryParams = {};
  let pairs = queryString.split('&');
  for (let i = 0; i < pairs.length; i++){
    let pair = pairs[i].split("=");
    let key = pair[0];
    let value = pair[1];
    queryParams[key] = value;
  }
  return queryParams;
}

function processHttpRequests(request, response) {
  if (request.method === "GET"){
    let queryParams = parseQueryParams(request.query);
    let temp = queryParams.temperature;
    sendTemperatureData(temp);
    console.log(temp);
    response.code = 200;
    response.send(true);
  } else if (request.method === "POST"){
    response.body = request.body;
    response.code = 201;
  }
  
  response.headers = [["Content-Type", "application/json"]];
  response.send(true);
}

HTTPServer.registerEndpoint("data", processHttpRequests);