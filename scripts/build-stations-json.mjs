// Builds src/lib/stations-data.json from the LEA Excel export and
// whatever's currently in data/geocode-cache.json — no network calls.
// Safe to re-run any time (e.g. while import-lea-data.mjs is still
// geocoding in the background) to pick up newly-cached addresses.
//
// Usage: node scripts/build-stations-json.mjs

import XLSX from "xlsx";
import { readdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

const DATA_DIR = path.resolve("data");
const CACHE_PATH = path.resolve("data/geocode-cache.json");
const OUTPUT_PATH = path.resolve("src/lib/stations-data.json");

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

function stableId(company, address) {
  const s = `${company}|${address}`;
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) | 0;
  return `s${Math.abs(hash).toString(36)}`;
}

const cache = existsSync(CACHE_PATH)
  ? JSON.parse(readFileSync(CACHE_PATH, "utf-8"))
  : {};

const file = findLatestExcel();
const wb = XLSX.readFile(file);
const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

const stations = [];
let skippedNotGeocoded = 0;
let skippedNoCoords = 0;

for (const row of rows) {
  const company = row["Įmonė"];
  const brand = row["Degalinės pavadinimas"] || company;
  const city = row["Savivaldybė"];
  const address = row["Adresas"];
  const date = row["Data"];
  if (!company || !address) continue;

  const coords = cache[address];
  if (coords === undefined) {
    skippedNotGeocoded++;
    continue;
  }
  if (!coords) {
    skippedNoCoords++;
    continue;
  }

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

writeFileSync(OUTPUT_PATH, JSON.stringify(stations, null, 2));
console.log(
  `Wrote ${stations.length} stations to ${OUTPUT_PATH} (${skippedNotGeocoded} not yet geocoded, ${skippedNoCoords} had no match, out of ${rows.length} total rows)`
);
