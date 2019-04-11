/*
 * Hearthstone Deck
 * Created by Shuqiao Zhang in 2019.
 * https://zhangshuqiao.org
 */

/* 
 * This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 */

const cardsJSON = require("./cards.collectible.json");
var cards = [];
for (var card of cardsJSON) {
	if (card.dbfId) {
		cards[card.dbfId] = card;
	}
}

const core = require("./core");

const express = require("express");
const app = express();
const path = require("path");

var port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
	var code = req.query.code || "AAEBAaoIBJsDoxTCrgLBiQMN/gXiDP8P5hausAKlvgL4vwL5vwKW7wKm7wKMhQPzigP2igMA",
		name = req.query.code || "炉石传说卡组",
		lang = req.query.lang || "zhCN";
	var ans = core(cards, code, name, lang);
	res.end(ans.toString());
});

const http = require("http");
const server = http.createServer(app);
server.listen(port, () => {
	console.log("Server listening at port %d", port);
});

process.on("uncaughtException", (error) => {
	if (config.debug) console.error("[FATAL ERROR] " + error);
	//process.exit(); //不强制退出可能产生不可控问题
});
