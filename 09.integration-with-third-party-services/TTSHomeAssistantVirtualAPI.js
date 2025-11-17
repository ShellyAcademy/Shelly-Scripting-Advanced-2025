const AUTH_TOKEN = "";
const TEXT_VC = "text:200";
const SPEAK_VC = "button:200";

const textVC = Virtual.getHandle(TEXT_VC);
const speakVC = Virtual.getHandle(SPEAK_VC);

function sendToHA(message) {
    let haUrl = "http://192.168.10.130:8123/api/services/tts/speak";
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

speakVC.on("single_push", function(eventData) {
  let textToSpeak = textVC.getValue();
  console.log("Speaking:", textToSpeak);
  sendToHA(textToSpeak);
});