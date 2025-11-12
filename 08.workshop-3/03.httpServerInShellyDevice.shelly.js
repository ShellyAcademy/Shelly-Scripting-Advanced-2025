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
    console.log(queryParams.name);
    response.code = 200;
    response.send(true);
  } else if (request.method === "POST"){
    console.log("post method");
    response.body = request.body;
    response.code = 201;
  }
  
  response.headers = [["Content-Type", "application/json"]];
  response.send(true);
}

HTTPServer.registerEndpoint("data", processHttpRequests);