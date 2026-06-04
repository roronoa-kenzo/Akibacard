import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

function parseEnv(content) {
  const env = {};
  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
  }
  return env;
}

async function getClient() {
  const env = parseEnv(await readFile(".env.local", "utf8"));
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars in .env.local");
  return createClient(url, key);
}

async function getGameId(supabase, slug) {
  const { data, error } = await supabase
    .from("tcg_games")
    .select("id")
    .eq("slug", slug)
    .single();
  if (error || !data?.id) {
    throw new Error(`Could not get game_id for "${slug}": ${error?.message ?? ""}`);
  }
  return data.id;
}

async function getExistingExternalIds(supabase, gameId) {
  const ids = new Set();
  const pageSize = 1000;
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("cards")
      .select("external_id")
      .eq("game_id", gameId)
      .range(from, from + pageSize - 1);
    if (error) throw new Error(`Could not read existing cards: ${error.message}`);
    if (!data?.length) break;
    for (const row of data) ids.add(row.external_id);
    if (data.length < pageSize) break;
  }
  return ids;
}

// Fetches every card from the API, then upserts only the ones missing from the
// DB. Prints "already up to date" when nothing new is found. `fetchAll` returns
// rows without `game_id` (external_id, name, image_url, rarity, set_name,
// market_price, metadata) — it is added here.
export async function importGame(slug, fetchAll) {
  const supabase = await getClient();
  const gameId = await getGameId(supabase, slug);

  console.log(`[${slug}] Fetching cards from API…`);
  const apiCards = await fetchAll();
  console.log(`[${slug}] API returned ${apiCards.length} cards.`);

  const existing = await getExistingExternalIds(supabase, gameId);
  const seen = new Set();
  const newCards = [];
  for (const card of apiCards) {
    if (existing.has(card.external_id) || seen.has(card.external_id)) continue;
    seen.add(card.external_id);
    newCards.push({ game_id: gameId, ...card });
  }

  if (newCards.length === 0) {
    console.log(`[${slug}] Already up to date — ${existing.size} cards in DB.`);
    return;
  }

  console.log(`[${slug}] Importing ${newCards.length} new cards…`);
  const batchSize = 500;
  for (let i = 0; i < newCards.length; i += batchSize) {
    const batch = newCards.slice(i, i + batchSize);
    const { error } = await supabase
      .from("cards")
      .upsert(batch, { onConflict: "game_id,external_id" });
    if (error) throw new Error(`Upsert failed: ${error.message}`);
    console.log(`[${slug}]   ${Math.min(i + batchSize, newCards.length)}/${newCards.length}`);
  }

  console.log(
    `[${slug}] Done — imported ${newCards.length} new cards (total ${existing.size + newCards.length}).`,
  );
}

export function run(promise) {
  promise.catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
