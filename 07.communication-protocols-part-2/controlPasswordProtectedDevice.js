let url = "http://admin:DenisB22@192.168.10.108/rpc/Switch.Toggle?id=0";

Shelly.call("HTTP.Get", {url: url}, function(result) {
  console.log(JSON.stringify(result));
});