let apiUrl = "https://reqbin.com/echo/post/json";

let body = {
  "Id": 1,
  "Customer": "Denis Bechiragich",
  "Quantity": 1,
  "Price": 19.90,
  "Device": "ShellyPlusPlugS"

}

Shelly.call("HTTP.Request",{
    method: "POST",
    url: apiUrl,
    body: body
  },
  function(result, errorCode, errorMessage) {
    if (errorCode === 0) {
      console.log("Successfully sent. Result is:", result.body);
    } else {
      console.log("There was an error:", errorMessage);
    }
  }
)