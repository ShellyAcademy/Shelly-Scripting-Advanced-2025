Shelly.addEventHandler(function (event) {
    if (event.info.component === "input:101") {
        console.log(JSON.stringify(event));
    }
    if (event.info.component === "input:101" && event.info.event === "single_push") {
        console.log("Button single pressed. Turning on light");
        let url = "http://192.168.10.108/rpc/Switch.Set?id=0&on=true";
        Shelly.call("HTTP.Get", { url: url }, function (result, errorCode, errorMessage) {
            console.log(result);
        });
    }
});