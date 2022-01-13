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

import fs from "fs";
const cardsJSON = JSON.parse(fs.readFileSync("./cards.collectible.json", "utf-8"));
const cards = [];
for (const card of cardsJSON) {
	if (card.dbfId) {
		cards[card.dbfId] = card;
	}
}

import core from "./core.js";

import MiServer from "mimi-server";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { app } = new MiServer({
	port: process.env.PORT || 8080,
	static: path.join(__dirname, "public")
});

import nunjucks from "nunjucks";

// https://github.com/EssenceOfChaos/express-nunjucks
app.set("view engine", "njk");
nunjucks.configure("templates", {
	autoescape: false,
	express: app
});

app.get("/", (req, res) => {
	const code = req.query.code || "AAEBAR8engGoAvYCtQPHA4cEyQTyBa4GxQjbCf4Mx64CmPACoIADp4IDm4UDoIUD9YkD5pYD+ZYDtpwDnp0D/KMD5KQDn6UDoqUDpqUDhKcDn7cDAAA=",
		name = req.query.name || "炉石传说卡组",
		lang = req.query.lang || "zhCN",
		lazy = req.query.lazy || "auto";
	const deckstring = code.replace(/\s/g, "+");
	const data = core(cards, deckstring);
	if (typeof data === "string") {
		res.render("error", { data });
	} else {
		res.render("layout", Object.assign({
			deckstring, name, lang, lazy
		}, data));
	}
});
