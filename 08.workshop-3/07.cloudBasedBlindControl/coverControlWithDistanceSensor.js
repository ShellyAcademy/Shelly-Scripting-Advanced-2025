function closeTheCoverIfSafeToOperate(distance, coverState){
  if (coverState == "closing" && distance >= 1500 && distance <= 2500){
    console.log("Found an obsticle in", distance, " and not opened!")
    Shelly.call("Cover.Stop", {id:0}, function(){
        Shelly.call("Cover.Open", {id:0});
    });
  }
}

Shelly.addEventHandler(function(data){
  if (data.component == "cover:0" && data.info.hasOwnProperty("event")){
    if (data.info.event === "closing"){
      let coverEvent = data.info.event;
      let distance = Shelly.getComponentStatus("bthomesensor:202").value;
      console.log(coverEvent);
      console.log(distance);
      closeTheCoverIfSafeToOperate(distance, coverEvent);
    }
  } else {
    console.log("different event that closing");
  }
})