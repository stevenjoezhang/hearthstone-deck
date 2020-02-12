const https = require("https");
const fs = require("fs");
const path = require("path");

function request(url) {
    https.get(url, res => {
        if (res.statusCode == 302) {
            request(res.headers.location);
            return;
        }
        let count = 0;
        let notifiedCount = 0;
        const outFile = fs.openSync(path.join(__dirname, "cards.collectible.json"), "w");
        res.on("data", data => {
            fs.writeSync(outFile, data, 0, data.length, null);
            count += data.length;
            if ((count - notifiedCount) > 800000) {
                console.log("Received %dK...", Math.floor(count / 1024));
                notifiedCount = count;
            }
        });
        res.on("end", () => {
            console.log("Received %dK total.", Math.floor(count / 1024));
            fs.closeSync(outFile);
        });
    }).on("error", err => {
        console.log("Error with http(s) request: " + err);
    });
}

console.log("Downloading cards.collectible.json")
request("https://api.hearthstonejson.com/v1/latest/all/cards.collectible.json");
