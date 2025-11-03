let illuminanceVcHandler = Virtual.getHandle("number:200");
let btightnesStatusVcHandler = Virtual.getHandle("enum:200");

illuminanceVcHandler.on("change", function (data) {
    let illumination = data.value;
    let status = "dark";

    if (illumination > 30 && illumination <= 200) {
        status = "twilight";
    } else if (illumination > 200) {
        status = "bright";
    }

    btightnesStatusVcHandler.setValue(status);
})

btightnesStatusVcHandler.on("change", function (data) {
    let position = 0;

    switch (data.value) {
        case "dark": position = 0; break;
        case "twilight": position = 50; break;
        case "bright": position = 100; break;
    }

    Shelly.call("Cover.GoToPosition", { id: 0, pos: position });
})