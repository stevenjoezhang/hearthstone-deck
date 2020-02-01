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
module.exports = function(db, deckstring, name, lang) {
	let deck = parse_deck(parse_deckstring(deckstring));
	if (typeof deck === "string") {
		return deck;
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
	return { deckstring, name, lang, row, deck_cards_ordered };
}
