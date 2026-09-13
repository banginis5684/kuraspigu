// Imports LEA's published "raw data" Excel export (data/degalu-kainos-*.xlsx)
// into src/lib/stations-data.json, geocoding each address via Nominatim
// (OpenStreetMap) with a persistent cache so re-runs only geocode new
// or changed addresses. Re-run this whenever a fresh export is dropped
// into data/.
//
// Usage: node scripts/import-lea-data.mjs

import XLSX from "xlsx";
import { readdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const DATA_DIR = path.resolve("data");
const CACHE_PATH = path.resolve("data/geocode-cache.json");
const OUTPUT_PATH = path.resolve("src/lib/stations-data.json");
const USER_AGENT = "KuraSpigu.lt/1.0 (contact: info@kuraspigu.lt)";
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

function findLatestExcel() {
  const files = readdirSync(DATA_DIR).filter(
    (f) => f.startsWith("degalu-kainos") && f.endsWith(".xlsx")
  );
  if (files.length === 0) throw new Error("No degalu-kainos*.xlsx file found in data/");
  files.sort();
  return path.join(DATA_DIR, files[files.length - 1]);
}

function parsePrice(value) {
  if (typeof value === "number") return Math.round(value * 1000) / 1000;
  return null;
}

function loadCache() {
  if (!existsSync(CACHE_PATH)) return {};
  return JSON.parse(readFileSync(CACHE_PATH, "utf-8"));
}

function saveCache(cache) {
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

function normalizeAddress(address) {
  // Raw format is "City, Street No, Postcode" — Nominatim parses much
  // better as "Street No, City" with the postcode dropped.
  const parts = address.split(",").map((p) => p.trim());
  if (parts.length >= 2 && /^\d{4,6}$/.test(parts[parts.length - 1])) {
    parts.pop();
  }
  if (parts.length >= 2) {
    const [city, ...rest] = parts;
    return `${rest.join(", ")}, ${city}`;
  }
  return parts.join(", ");
}

async function geocodeQuery(q) {
  const url = `${NOMINATIM_URL}?format=json&limit=1&countrycodes=lt&q=${encodeURIComponent(q)}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Nominatim ${res.status} for "${q}"`);
    const data = await res.json();
    if (data.length === 0) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } finally {
    clearTimeout(timeout);
  }
}

// Single attempt only (normalized address) — a second sequential request
// per miss made the run impractically slow. Addresses that don't match
// are left uncoded for a future improved pass rather than retried here.
async function geocode(address) {
  const normalized = normalizeAddress(address);
  return geocodeQuery(normalized).catch(() => null);
}

function stableId(company, address) {
  const s = `${company}|${address}`;
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) | 0;
  }
  return `s${Math.abs(hash).toString(36)}`;
}

async function main() {
  const file = findLatestExcel();
  console.log(`Reading ${file}`);
  const wb = XLSX.readFile(file);
  const sheetName = wb.SheetNames[0];
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
  console.log(`${rows.length} rows found`);

  const cache = loadCache();
  const stations = [];
  let geocodedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const company = row["Įmonė"];
    const brand = row["Degalinės pavadinimas"] || company;
    const city = row["Savivaldybė"];
    const address = row["Adresas"];
    const date = row["Data"];
    if (!company || !address) continue;

    const fullAddress = `${address}`;
    let coords = cache[fullAddress];

    if (coords === undefined) {
      try {
        const start = Date.now();
        coords = await geocode(fullAddress, city);
        const elapsed = Date.now() - start;
        cache[fullAddress] = coords;
        geocodedCount++;
        if (elapsed > 3000) {
          console.log(`  [slow: ${elapsed}ms] "${fullAddress}"`);
        }
        if (geocodedCount % 10 === 0) {
          console.log(`  geocoded ${geocodedCount} new addresses so far...`);
          saveCache(cache);
        }
        // respect Nominatim's 1 request/second usage policy
        await new Promise((r) => setTimeout(r, 1100));
      } catch (err) {
        console.warn(`  geocode failed for "${fullAddress}": ${err.message}`);
        coords = null;
        cache[fullAddress] = null;
        failedCount++;
      }
    }

    if (!coords) continue; // skip stations we couldn't place on the map

    stations.push({
      id: stableId(company, address),
      brand,
      city,
      address,
      lat: coords.lat,
      lng: coords.lng,
      prices: {
        a95: parsePrice(row["95 benzinas"]),
        diesel: parsePrice(row["Dyzelinas"]),
        lpg: parsePrice(row["SND"]),
      },
      updatedAt: date,
    });
  }

  saveCache(cache);
  writeFileSync(OUTPUT_PATH, JSON.stringify(stations, null, 2));
  console.log(
    `Wrote ${stations.length} stations to ${OUTPUT_PATH} (${geocodedCount} newly geocoded, ${failedCount} failed, ${rows.length - stations.length - failedCount} skipped/unplaceable)`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
