let AUTH_TOKEN = "<HA-API-KEY>";

function sendToHA(message) {
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

Shelly.addEventHandler(function(evData){
  if (evData.hasOwnProperty("info") && evData.info.event === "TTS"){
    let message = evData.info.data.message;
    sendToHA(message);
  }  
})