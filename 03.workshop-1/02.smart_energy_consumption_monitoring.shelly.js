function sendEmailNotification(totalPowerConsumption, isCritical) {
    const apiKey = "<brevo-api-key>";
    const apiUrl = "https://api.brevo.com/v3/smtp/email";

    const headers = {
        "api-key": apiKey,
        "Content-Type": "application/json"
    };

    let sender = { name: "Emre", email: "noreply@shelly.academy" };
    let receiver = { name: "Alex", email: "<receiver-email>" };
    let currentHour = Shelly.getComponentStatus("Sys").time;
    
    let additionalDetails = isCritical ? "Your device was forcibly <strong>turned off!</strong><br>" : "";

    let redirectLink = "https://www.google.com/";

    let htmlContent = ""
        + "<!DOCTYPE html>"
        + "<html lang=\"en\">"
        + "<head><meta charset=\"UTF-8\"><title>Energy Consumption Update</title></head>"
        + "<body style=\"margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;\">"
        + "  <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">"
        + "    <tr><td align=\"center\">"
        + "      <table width=\"100%\" cellpadding=\"20\" cellspacing=\"0\" style=\"max-width:600px;margin:auto;"
        + "        background:#ffffff;border:1px solid #dde2e6;border-radius:8px;\">"
        + "        <tr><td style=\"height:6px;background:#2b5d84;text-align:center;padding:30px 0;\">"
        + "          <h1 style=\"margin:0;font-size:28px;color:#ffffff;\">Shelly Energy Report</h1>"
        + "        </td></tr>"
        + "        <tr><td style=\"height:6px;background:#4594d1;\"></td></tr>"
        + "        <tr><td style=\"padding:20px 20px 10px;\">"
        + "          <h2 style=\"margin:0;color:#34495e;font-size:22px;\">Your Device's Last Minute Energy Snapshot</h2>"
        + "        </td></tr>"
        + "        <tr><td style=\"padding:0 20px 20px;\">"
        + "          <p style=\"margin:0 0 16px;color:#555555;font-size:16px;line-height:1.5;\">"
        + "            Hello <strong>" + receiver.name + "</strong>,<br>"
        + "            Abnormal power usage was detected for past one minute! <br>"
        + additionalDetails
        + "            Current time of Shelly device: <strong>" + currentHour + "</strong>"
        + "          </p>"
        + "        </td></tr>"
        + "        <tr><td style=\"padding:0 20px 20px;\">"
        + "          <div style=\"background:#ecf0f1;border:1px solid #bdc3c7;border-radius:6px;"
        + "            padding:20px;text-align:center;\">"
        + "            <p style=\"margin:0;color:#7f8c8d;font-size:14px;\">Total Consumption</p>"
        + "            <p style=\"margin:8px 0 0;color:#2c3e50;font-size:28px;font-weight:bold;\">"
        + totalPowerConsumption + " W"
        + "            </p>"
        + "          </div>"
        + "        </td></tr>"
        + "        <tr><td align=\"center\" style=\"padding:0 20px 30px;\">"
        + "          <a href=\"" + redirectLink + "\""
        + "             style=\"display:inline-block;padding:12px 24px;border-radius:6px;"
        + "               background:#e74c3c;color:#ffffff;text-decoration:none;font-size:16px;\">"
        + "            View Dashboard"
        + "          </a>"
        + "        </td></tr>"
        + "        <tr><td style=\"padding:20px;border-top:1px solid #dde2e6;"
        + "          font-size:12px;color:#888888;text-align:center;\">"
        + "          Sent by <strong>" + sender.name + " • Shelly Academy</strong>"
        + "        </td></tr>"
        + "      </table>"
        + "    </td></tr>"
        + "  </table>"
        + "</body>"
        + "</html>";

    let body = {
        sender: sender,
        to: [receiver],
        subject: "Last Minute Abnormal Energy Usage Report",
        htmlContent: htmlContent
    };

    Shelly.call(
        "HTTP.Request",
        {
            method: "POST",
            url: apiUrl,
            headers: headers,
            body: JSON.stringify(body)
        },
        function (result, errorCode, errorMessage) {
            if (errorCode === 0) {
                console.log("Email sent successfully:", result.body);
            } else {
                console.error("Error sending email:", errorMessage);
            }
        }
    );
}

// let energyUsage = 0;
// sendEmailNotification(energyUsage, false);

//{"component":"switch:0","name":"switch","id":0,"delta":{"apower":42.3}}

let highEnergyConsumptionTH = 40;
let highEnergyConsumptionTimerHandler = null;

let criticalEnergyConsumptionTH = 60;
let criticalEnergyConsumptionTimerHandler = null;

function actionToExcecuteAfterTimerEnds(payload) {
    sendEmailNotification(payload.energyUsage, payload.isCritical);

    if (payload.isCritical){
        Shelly.call("Switch.Set", {id:0, on: false});
        Shelly.call("Switch.Set", {id:1, on: false});
    }
}

let deviceEnergyConsumptionArr = [0,0,0,0];

Shelly.addStatusHandler(function(data){
    if (data.name === "switch" && data.delta.hasOwnProperty("apower")){
        let totalEnergyConsumption = 0;
        deviceEnergyConsumptionArr[data.id] = data.delta.apower;

        for (let element of deviceEnergyConsumptionArr) {
            totalEnergyConsumption+= element;
        }
        
        if (totalEnergyConsumption > criticalEnergyConsumptionTH && Timer.getInfo(criticalEnergyConsumptionTimerHandler) == null){
            console.log("Critical energy consumption is detected:", totalEnergyConsumption);
            criticalEnergyConsumptionTimerHandler = Timer.set(1000 * 10,
            false,
            actionToExcecuteAfterTimerEnds, {energyUsage: totalEnergyConsumption, isCritical: true})
        } else if (totalEnergyConsumption >= highEnergyConsumptionTH && Timer.getInfo(highEnergyConsumptionTimerHandler) == null){
            console.log("High energy consumption is detected:", totalEnergyConsumption);
            highEnergyConsumptionTimerHandler = Timer.set(1000 * 10,
            false,
            actionToExcecuteAfterTimerEnds, {energyUsage: totalEnergyConsumption, isCritical: false})
        }

        if (totalEnergyConsumption < highEnergyConsumptionTH && (Timer.getInfo(highEnergyConsumptionTimerHandler) != null
        || Timer.getInfo(criticalEnergyConsumptionTimerHandler) != null)){
            console.log("Deleting timers!");
            Timer.clear(highEnergyConsumptionTimerHandler);
            Timer.clear(criticalEnergyConsumptionTimerHandler);
        }
    }
})