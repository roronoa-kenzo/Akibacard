import { importGame, run } from "./lib.mjs";

const PAGE_SIZE = 250;

function getMarketPrice(prices) {
  if (!prices || typeof prices !== "object") return null;
  const priority = [
    "normal",
    "holofoil",
    "reverseHolofoil",
    "1stEditionHolofoil",
    "unlimitedHolofoil",
  ];
  for (const key of priority) {
    const market = prices[key]?.market;
    if (market != null && Number.isFinite(Number(market))) {
      return Number(market);
    }
  }
  return null;
}

async function fetchPage(page) {
  const url = new URL("https://api.pokemontcg.io/v2/cards");
  url.searchParams.set("page", String(page));
  url.searchParams.set("pageSize", String(PAGE_SIZE));
  url.searchParams.set("select", "id,name,images,rarity,set,tcgplayer");

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Pokemon API error on page ${page}: ${res.status}`);
  return res.json();
}

async function fetchAll() {
  const first = await fetchPage(1);
  const totalPages = Math.ceil((first.totalCount ?? 0) / PAGE_SIZE);
  const cards = [];

  for (let page = 1; page <= totalPages; page++) {
    const payload = page === 1 ? first : await fetchPage(page);
    for (const card of payload.data ?? []) {
      cards.push({
        external_id: card.id,
        name: card.name,
        image_url: card.images?.large ?? card.images?.small ?? null,
        rarity: card.rarity ?? null,
        set_name: card.set?.name ?? null,
        market_price: getMarketPrice(card.tcgplayer?.prices),
        metadata: { source: "pokemontcg", api: "https://api.pokemontcg.io/v2/cards" },
      });
    }
  }

  return cards;
}

run(importGame("pokemon", fetchAll));
