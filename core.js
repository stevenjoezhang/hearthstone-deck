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

function parse_deckstring(deckstring) {
	let binary = Buffer.from(deckstring, "base64");
	let hex = binary.toString("hex");
	let arr = hex.match(/.{1,2}/g);
	return arr.map(x => parseInt(x, 16));
}
function read_varint(data) {
	let shift = 0;
	let result = 0;
	let c;
	do {
		c = data.shift();
		result |= (c & 0x7f) << shift;
		shift += 7;
	}
	while (c & 0x80);
	return result;
}
function parse_deck(data) {
	let reserve = read_varint(data);
	if (reserve !== 0) {
		return "Invalid deckstring";
	}
	let version = read_varint(data);
	if (version !== 1) {
		return "Unsupported deckstring version " + version;
	}
	let format = read_varint(data);
	let heroes = [];
	let num_heroes = read_varint(data);
	for (let i = 0; i < num_heroes; i++) {
		heroes.push(read_varint(data));
	}
	let cards = [];
	let num_cards_x1 = read_varint(data);
	for (let i = 0; i < num_cards_x1; i++) {
		card_id = read_varint(data);
		cards.push([card_id, 1]);
	}
	let num_cards_x2 = read_varint(data);
	for (let i = 0; i < num_cards_x2; i++) {
		card_id = read_varint(data);
		cards.push([card_id, 2]);
	}
	let num_cards_xn = read_varint(data);
	for (let i = 0; i < num_cards_xn; i++) {
		let card_id = read_varint(data);
		let count = read_varint(data);
		cards.push([card_id, count]);
	}
	return { cards, heroes, format };
}
function build_content(deck_cards_ordered, lang) {
	let content = "";
	for (let card of deck_cards_ordered) {
		content += `<li class="deck-entry deck-entry-with${ (card[1] === 1 && card[2].rarity !== "LEGENDARY") ? "out" : "" }-amount">
				<div class="hs-tile-img">
					<img src="https://art.hearthstonejson.com/v1/tiles/${card[2].id}.png">
				</div>
				<div class="hs-tile-shade"></div>
				<div class="hs-tile-borders"></div>
				<div class="hs-tile-mana"></div>
				<div class="hs-tile-info">
					<span class="hs-tile-info-left">${card[2].cost}</span>
					<span class="hs-tile-info-middle">
						<span>${card[2].name[lang]}</span>
					</span>
					<span class="hs-tile-info-right">
					${
						(function() {
							if (card[1] === 1 && card[2].rarity === "LEGENDARY") {
								return `<img src="img/star.png">`;
							}
							if (card[1] !== 1) {
								return card[1];
							}
							return ""
						})()
					}
					</span>
				</div>
				<div class="preview-card">
					${
						(function() {
							if (lang === "zhCN") {
								let purify_name = card[2].name.enUS.replace(/\s|'|,|!|:|-/g, "");
								//return `<img src="http://hearthstone.nos.netease.com/1/hscards/${card[2].cardClass}__${card[2].id}_zhCN_${purify_name}.png">`;
							}
							return `<img src="https://art.hearthstonejson.com/v1/render/latest/${lang}/512x/${card[2].id}.png">`;
						})()
					}
				</div>
			</li>`;
	}
	return content;
}
function build_html(deckstring, name, lang, row, deck_cards_ordered) {
	let content = build_content(deck_cards_ordered, lang);
	return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="user-scalable=no, viewport-fit=cover">
<title>${name}</title>
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="fonts/fonts.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/HubSpot/pace/themes/black/pace-theme-center-circle.css">
<script src="https://cdn.jsdelivr.net/gh/HubSpot/pace/pace.min.js"></script>
</head>
<body>
<section class="section-decklist">
	<div class="hs-decklist-container">
		<div class="hs-decklist-hero">
			<div class="hs-decklist-hero-frame">
				<img src="img/CustomDeck_phone-Recovered.png" class="hero-frame">
				<img src="https://art.hearthstonejson.com/v1/512x/${row.id}.jpg" class="hero-image">
			</div>
			<div class="hs-decklist-title">
				<input id="deck-title-input" data-deckcode="${deckstring}" type="text" value="${name}" maxlength="30">
			</div>
		</div>
		<ul class="hs-decklist">
			${content}
		</ul>
	</div>
</section>
<script src="js/deck.js"></script>
</body>
</html>`;
}
module.exports = function(db, deckstring, name, lang) {
	let deck = parse_deck(parse_deckstring(deckstring));
	if (typeof deck === "string") {
		return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="user-scalable=no, viewport-fit=cover">
<title>Error!</title>
</head>
<body>
<h1>Error!</h1>
<p>${deck}</p>
</body>
</html>`;
	}
	let max_cost = 0;
	for (let card of deck.cards) {
		let dbfId = card[0];
		let row = db[dbfId];
		card.push(row);
		if (row.cost > max_cost) {
			max_cost = row.cost;
		}
	}
	row = db[deck.heroes[0]];
	let deck_cards_ordered = [];
	let rarity_tags = ["FREE", "COMMON", "RARE", "EPIC", "LEGENDARY"];
	for (let i = 0; i <= max_cost; i++) {
		for (let t of rarity_tags) {
			for (let x of deck.cards) {
				if (x[2].cost === i && x[2].rarity === t) {
					deck_cards_ordered.push(x);
				}
			}
		}
	}
	deck.cards = deck_cards_ordered;
	return build_html(deckstring, name, lang, row, deck_cards_ordered);
}
