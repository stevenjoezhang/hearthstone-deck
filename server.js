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
const nunjucks = require("nunjucks");
const path = require("path");

// https://github.com/EssenceOfChaos/express-nunjucks
app.set("view engine", "njk");
nunjucks.configure("templates", {
	autoescape: false,
	express: app,
	watch: true
});

app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
	let code = req.query.code || "AAEBAf0GAA/OBpcHzAjiDP8PyBTmFrasAq6wAqW+Avi/Avm/AqLNAvjQAqbvAgA=",
		name = req.query.name || "炉石传说卡组",
		lang = req.query.lang || "zhCN",
		lazy = req.query.lazy || "auto";
	let deckstring = code.replace(/\s/g, "+");
	let data = core(cards, deckstring);
	if (typeof data === "string") {
		res.render("error", { data });
	} else {
		res.render("layout", Object.assign({
			deckstring, name, lang, lazy
		}, data));
	}
});

const http = require("http");
const server = http.createServer(app);

var port = process.env.PORT || 8080;
server.listen(port, () => {
	console.log("Server listening at port %d", port);
});
