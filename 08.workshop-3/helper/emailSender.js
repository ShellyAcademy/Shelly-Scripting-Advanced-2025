let events = [
    {open: "10:30", close: "10:32", durationInSeconds: 123},
    {open: "10:35", close: "10:36", durationInSeconds: 65},
    {open: "11:25", close: "11:28", durationInSeconds: 185},
    {open: "12:22", close: "12:22", durationInSeconds: 55}
];

function sendEmailNotification() {
    console.log("Script started");
    
    let apiKey = "<api-key>";
    let apiUrl = "https://api.brevo.com/v3/smtp/email";

    let sender = { name: "Emre", email: "noreply@shelly.academy" };
    let receiver = { name: "Alex", email: "<receiver-email>" };
    let subject = "Daily Door Sensor Report";
    
    console.log("Processing events");
    
    // Build event rows
    let rows = "";
    let totalDuration = 0;
    let count = events.length;
    
    let i = 0;
    while (i < count) {
        let e = events[i];
        totalDuration = totalDuration + e.durationInSeconds;
        
        let sec = e.durationInSeconds;
        let min = 0;
        if (sec >= 60) {
            min = sec / 60;
            let ms = JSON.stringify(min);
            if (ms.indexOf('.') >= 0) {
                ms = ms.slice(0, ms.indexOf('.'));
            }
            min = JSON.parse(ms);
            sec = e.durationInSeconds - (min * 60);
        }
        
        let dur = "";
        if (min > 0) {
            dur = JSON.stringify(min) + "m " + JSON.stringify(sec) + "s";
        } else {
            dur = JSON.stringify(sec) + "s";
        }
        
        let bg = "#fff";
        if (i % 2 === 0) {
            bg = "#f8f9fa";
        }
        
        rows = rows 
            + "<tr style='background:" + bg + "'>"
            + "<td style='padding:12px'>" + JSON.stringify(i + 1) + "</td>"
            + "<td style='padding:12px;color:#28a745'>" + e.open + "</td>"
            + "<td style='padding:12px;color:#dc3545'>" + e.close + "</td>"
            + "<td style='padding:12px;text-align:right'>" + dur + "</td>"
            + "</tr>";
        
        i = i + 1;
    }
    
    console.log("Calculating totals");
    
    let tsec = totalDuration;
    let tmin = 0;
    if (tsec >= 60) {
        tmin = tsec / 60;
        let ms = JSON.stringify(tmin);
        if (ms.indexOf('.') >= 0) {
            ms = ms.slice(0, ms.indexOf('.'));
        }
        tmin = JSON.parse(ms);
        tsec = totalDuration - (tmin * 60);
    }
    
    let totalDur = "";
    if (tmin > 0) {
        totalDur = JSON.stringify(tmin) + "m " + JSON.stringify(tsec) + "s";
    } else {
        totalDur = JSON.stringify(tsec) + "s";
    }
    
    console.log("Building HTML");
    
    let htmlContent = "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><title>" + subject + "</title></head>"
        + "<body style='margin:0;padding:20px;background:#e8e8e8;font-family:Arial,sans-serif'>"
        + "<div style='max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;border:2px solid #d0d0d0;box-shadow:0 4px 12px rgba(0,0,0,0.1)'>"
        + "<div style='background:#2b5d84;padding:30px;text-align:center'>"
        + "<h1 style='margin:0;color:#fff;font-size:28px'>Door Activity Report</h1>"
        + "<p style='margin:5px 0 0;color:#fff'>Daily Summary</p>"
        + "</div>"
        + "<div style='padding:30px'>"
        + "<p style='margin:0;font-size:16px'>Hi <strong>" + receiver.name + "</strong>,</p>"
        + "<p style='margin:10px 0 0;color:#666'>Your daily summary of door sensor activity.</p>"
        + "</div>"
        + "<div style='padding:0 30px 20px'>"
        + "<table width='100%' cellpadding='0' cellspacing='0'><tr>"
        + "<td style='width:48%;padding:20px;background:#aa0017;border-radius:8px;text-align:center'>"
        + "<p style='margin:0;color:#fff;font-size:12px'>TOTAL OPENINGS</p>"
        + "<p style='margin:5px 0 0;color:#fff;font-size:36px;font-weight:bold'>" + JSON.stringify(count) + "</p>"
        + "</td>"
        + "<td style='width:4%'></td>"
        + "<td style='width:48%;padding:20px;background:#2b5d84;border-radius:8px;text-align:center'>"
        + "<p style='margin:0;color:#fff;font-size:12px'>TOTAL DURATION</p>"
        + "<p style='margin:5px 0 0;color:#fff;font-size:28px;font-weight:bold'>" + totalDur + "</p>"
        + "</td>"
        + "</tr></table>"
        + "</div>"
        + "<div style='padding:0 30px 30px'>"
        + "<h2 style='margin:0 0 15px;font-size:18px;color:#333'>Activity Log</h2>"
        + "<table width='100%' cellpadding='0' cellspacing='0' style='background:#f8f9fa;border-radius:8px;overflow:hidden;border:1px solid #d0d0d0'>"
        + "<tr style='background:#2b5d84'>"
        + "<th style='padding:12px;color:#fff;text-align:left;font-size:14px'>#</th>"
        + "<th style='padding:12px;color:#fff;text-align:left;font-size:14px'>Opened</th>"
        + "<th style='padding:12px;color:#fff;text-align:left;font-size:14px'>Closed</th>"
        + "<th style='padding:12px;color:#fff;text-align:right;font-size:14px'>Duration</th>"
        + "</tr>"
        + rows
        + "</table>"
        + "</div>"
        + "<div style='padding:20px 30px;background:#f8f9fa;text-align:center;border-top:1px solid #e0e0e0'>"
        + "<p style='margin:0;color:#666;font-size:12px'>Report from <strong>" + sender.name + "</strong></p>"
        + "<p style='margin:5px 0 0;color:#999;font-size:11px'>Shelly Academy</p>"
        + "</div>"
        + "</div>"
        + "</body></html>";
    
    console.log("HTML complete, sending email");

    let body = {
        sender: sender,
        to: [receiver],
        subject: subject,
        htmlContent: htmlContent
    };

    Shelly.call(
        "HTTP.Request",
        {
            method: "POST",
            url: apiUrl,
            headers: {
                "api-key": apiKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        },
        function (result, errorCode, errorMessage) {
            if (errorCode === 0) {
                console.log("Email sent successfully");
            } else {
                console.log("Error sending email:", errorCode, errorMessage);
            }
        }
    );
    
    console.log("Request sent");
}



console.log("Starting email notification");
sendEmailNotification();
console.log("Script completed");