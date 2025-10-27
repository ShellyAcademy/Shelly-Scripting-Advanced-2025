// Temperature
// http://192.168.1.54/rpc/WebHook.Create?event=temperature.change&cid=0&enable=true&name=tempChange&urls=["http://192.168.1.144/rpc/Switch.Set?id=0%26on=false"]&condition="ev.tC > 22"
// http://192.168.1.54/rpc/WebHook.Create?event=temperature.change&cid=0&enable=true&name=tempChangeDown&urls=["http://192.168.1.144/rpc/Switch.Set?id=0%26on=false"]&condition="ev.tC < 22"

// Humidity
// http://192.168.1.54/rpc/WebHook.Create?event=humidity.change&cid=0&enable=true&name=himidityDown&urls=["http://192.168.1.144/rpc/Switch.Set?id=0%26on=false"]&condition="ev.rh < 30"
// http://192.168.1.54/rpc/WebHook.Create?event=humidity.change&cid=0&enable=true&name=himidityDown&urls=["http://192.168.1.144/rpc/Switch.Set?id=0%26on=false"]&condition="ev.rh > 30"