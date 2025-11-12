let timerInterval = 2000;
let timerHandler = undefined;

function timerEvent(){
  console.log("I am an event!");
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
    console.log(queryParams.interval, "in seconds!");
    Timer.clear(timerHandler);
    timerHandler = Timer.set(queryParams.interval, true, timerEvent)
    response.code = 200;
  } else if (request.method === "POST"){
    console.log("post method");
    response.body = request.body;
    response.code = 201;
  }
  
  response.headers = [["Content-Type", "application/json; charset=UTF-8"]];
  response.send(true);
}

HTTPServer.registerEndpoint("data", processHttpRequests);

let timerHandler = Timer.set(timerInterval, true, timerEvent);