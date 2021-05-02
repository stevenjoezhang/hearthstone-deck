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
	const binary = Buffer.from(deckstring, "base64");
	const hex = binary.toString("hex");
	const arr = hex.match(/.{1,2}/g);
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
	const reserve = read_varint(data);
	if (reserve !== 0) {
		return "Invalid deckstring";
	}
	const version = read_varint(data);
	if (version !== 1) {
		return "Unsupported deckstring version " + version;
	}
	const format = read_varint(data);
	const heroes = [];
	const num_heroes = read_varint(data);
	for (let i = 0; i < num_heroes; i++) {
		heroes.push(read_varint(data));
	}
	const cards = [];
	const num_cards_x1 = read_varint(data);
	for (let i = 0; i < num_cards_x1; i++) {
		const card_id = read_varint(data);
		cards.push([card_id, 1]);
	}
	const num_cards_x2 = read_varint(data);
	for (let i = 0; i < num_cards_x2; i++) {
		const card_id = read_varint(data);
		cards.push([card_id, 2]);
	}
	const num_cards_xn = read_varint(data);
	for (let i = 0; i < num_cards_xn; i++) {
		const card_id = read_varint(data);
		const count = read_varint(data);
		cards.push([card_id, count]);
	}
	return { cards, heroes, format };
}
export default function(db, deckstring) {
	const deck = parse_deck(parse_deckstring(deckstring));
	if (typeof deck === "string") {
		return deck;
	}
	const hero = db[deck.heroes[0]];
	const rarity = {
		"FREE": [0, 0, 0],
		"COMMON": [1, 40, 400],
		"RARE": [2, 100, 800],
		"EPIC": [3, 400, 1600],
		"LEGENDARY": [4, 1600, 3200]
	};
	const dust = {
		common: 0,
		golden: 0
	};
	const deck_cards = deck.cards.map(card => {
		const [dbfId, count] = card;
		card = db[dbfId];
		if (!card) return null;
		dust.common += count * rarity[card.rarity][1];
		dust.golden += count * rarity[card.rarity][2];
		return [card, count];
	}).filter(card => card);
	deck_cards
		.sort((x, y) => rarity[x[0].rarity][0] - rarity[y[0].rarity][0])
		.sort((x, y) => x[0].cost - y[0].cost);
	return { hero, dust, deck_cards };
}
