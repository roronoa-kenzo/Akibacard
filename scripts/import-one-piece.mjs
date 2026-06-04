import { importGame, run } from "./lib.mjs";

const API = "https://optcgapi.com/api";

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`One Piece API error ${res.status} on ${url}`);
  return res.json();
}

function toPrice(value) {
  return Number.isFinite(Number(value)) ? Number(value) : null;
}

async function fetchAll() {
  const sets = await fetchJson(`${API}/allSets/`);
  const cards = [];

  for (const set of sets) {
    const setCards = await fetchJson(`${API}/sets/${set.set_id}/`);
    for (const card of setCards) {
      cards.push({
        external_id: card.card_set_id,
        name: card.card_name,
        image_url:
          card.card_image ??
          `https://optcgapi.com/media/static/Card_Images/${card.card_set_id}.jpg`,
        rarity: card.rarity ?? null,
        set_name: card.set_name ?? null,
        market_price: toPrice(card.market_price),
        metadata: {
          source: "optcgapi",
          api: `${API}/sets/`,
          set_id: card.set_id ?? set.set_id,
          card_type: card.card_type ?? null,
          card_color: card.card_color ?? null,
        },
      });
    }
    console.log(`[one-piece]   ${set.set_id}: ${setCards.length} cards`);
  }

  return cards;
}

run(importGame("one-piece", fetchAll));
