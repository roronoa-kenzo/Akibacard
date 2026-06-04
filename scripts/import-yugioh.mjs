import { importGame, run } from "./lib.mjs";

const API = "https://db.ygoprodeck.com/api/v7/cardinfo.php";

function toPrice(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

async function fetchAll() {
  const res = await fetch(API);
  if (!res.ok) throw new Error(`Yu-Gi-Oh API error ${res.status}`);
  const { data } = await res.json();

  return (data ?? []).map((card) => ({
    external_id: String(card.id),
    name: card.name,
    image_url: card.card_images?.[0]?.image_url ?? null,
    rarity: card.card_sets?.[0]?.set_rarity ?? null,
    set_name: card.card_sets?.[0]?.set_name ?? null,
    market_price: toPrice(card.card_prices?.[0]?.tcgplayer_price),
    metadata: {
      source: "ygoprodeck",
      api: API,
      type: card.type ?? null,
      race: card.race ?? null,
      archetype: card.archetype ?? null,
    },
  }));
}

run(importGame("yugioh", fetchAll));
