const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkODVkMDM5NjliNGU0NDY5YWZlY2ZjMWVjMjU1ZjhiOSIsImlhdCI6MTc2MzMxNzYwNywiZXhwIjoyMDc4Njc3NjA3fQ.9otp1m9GYBPQZBPXwWMfwoCw1QCyFnfztNSdFUexgK4";

function sendToHaTts(message) {
    let haUrl = "http://192.168.10.201:8123/api/services/tts/speak";
    let data = {
        "entity_id": "tts.google_translate_en_com",
        "media_player_entity_id": "media_player.living_room_speaker",
        "message": message
    };

    let request = {
        url: haUrl,
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Authorization": "Bearer " + AUTH_TOKEN
        }
    };
    Shelly.call("HTTP.Request", request);
}

function sendToHaTurnOffTV() {
    let haUrl = "http://192.168.10.201:8123/api/services/media_player/turn_off";
    let data = {
        entity_id: "media_player.living_room_tv"
    };

    let request = {
        url: haUrl,
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Authorization": "Bearer " + AUTH_TOKEN
        }
    };
    Shelly.call("HTTP.Request", request);
}

Shelly.addEventHandler(function(evData){
  if (evData.hasOwnProperty("info")){
    let eventName = evData.info.event;
    if (eventName === "TTS"){
      let message = evData.info.data.message;
      sendToHaTts(message);  
      console.log(message);
    } else if (eventName === "TV" && evData.info.data.message == "off"){
       sendToHaTurnOffTV();
    }
  }
})