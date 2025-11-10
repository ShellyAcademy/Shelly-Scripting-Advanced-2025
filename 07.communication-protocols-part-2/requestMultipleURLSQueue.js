const URLS = [
  "http://192.168.10.230/rpc/Shelly.GetDeviceInfo",
  "http://192.168.10.185/rpc/Shelly.GetDeviceInfo",
  "http://192.168.10.200/rpc/Shelly.GetDeviceInfo",
  "http://192.168.10.230/rpc/Shelly.GetDeviceInfo",
  "http://192.168.10.147/rpc/Shelly.GetDeviceInfo",
  "http://192.168.10.230/rpc/Shelly.GetDeviceInfo",
  "http://192.168.10.185/rpc/Shelly.GetDeviceInfo",
  "http://192.168.10.200/rpc/Shelly.GetDeviceInfo",
  "http://192.168.10.230/rpc/Shelly.GetDeviceInfo",
  "http://192.168.10.147/rpc/Shelly.GetDeviceInfo"
]

const MAX_CONCURRENT_URLS = 4;
  
function Queue() {
  this.items = [];

  this.isEmpty = function () {
    return this.items.length === 0;
  };

  this.enqueue = function (element) {
    this.items.push(element);
  };


  this.dequeue = function () {
    if (this.isEmpty()) {
        return 'Queue is empty';
    }
    return this.items.splice(0, 1)[0];
  };

  this.size = function () {
    return this.items.length;
  };

  this.front = function () {
    if (this.isEmpty()) {
        return 'Queue is empty';
    }
    return this.items[0];
  };
}

const urlQueue = new Queue();
let requestsCounter = 0;

function on_http_response(response) {
  requestsCounter--;
  // check if there are more urls to be requested
  if (!urlQueue.isEmpty()) {
    url = urlQueue.dequeue();
    console.log("New url loaded from queue:", url);
    fetch_url(url);    
  } else {
    console.log("No more urls to fetch");
  }
}

function fetch_url(url) {
  if (requestsCounter < MAX_CONCURRENT_URLS) {
    // if current requests are less than maximum concurrent ulrs
    // we can safely make new request
    requestsCounter++;
    console.log("Requesting", url);
    Shelly.call("HTTP.GET", {url: url}, on_http_response)
  } else {
    console.log("Too many current requests. Adding", url, "to queue");
    urlQueue.enqueue(url);
  }
}

function run_all_urls() {
  // function to fetch all urls in the URL constant array
  for (url of URLS) {
    fetch_url(url);
  }
}

run_all_urls();