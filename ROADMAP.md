# KuraSpigu app roadmap (v2)

Captured from the product vision for turning the current marketing/comparison
site into a full app. Nothing here is built yet — this is a spec to build
from when we start this phase.

## Vision

Evolve KuraSpigu from a static price-comparison page into an app people
return to: it tracks prices for them and helps them find the cheapest fuel
near their current location or along a route.

## Core features

### 1. Price tracking & alerts

- Users can follow specific stations (favorites).
- Notifications fire when:
  - the price changes at a followed station, or
  - a cheaper station appears nearby / in their area.
- Requires: user accounts, a favorites store, and a notification channel
  (web push for the PWA path, or native push if we go native).

### 2. Find cheapest stations nearby

- Uses device geolocation to show the closest stations and their best
  prices on a map.
- Standard OS/browser permission prompt:
  - "Allow KuraSpigu to access this device's location?"
  - Precision: **Precise** / **Approximate**
  - Duration: **While using the app** / **Only this time** / **Don't allow**
- Must degrade gracefully when location is denied (fall back to city
  search).

### 3. Search & filters (top bar)

- Search box: "Search for a station or location".
- Filters next to the search box:
  - **Miestas** (city) — dropdown
  - **Station** — dropdown
  - **Distance from me** — 5 km increments (5, 10, 15, 20 km, ...)
  - **Route** — from / to, to find cheapest stations along a route
  - **Price range** — slider over the current distribution of prices
    (cheapest to most expensive)
  - **Sort by price** — cheapest first / most expensive first
  - "Show results" action

### 4. Data source

- Real price data is meant to come from **LEA** (Lietuvos energetikos
  agentūra).
- Data refreshes on a set day (e.g. Monday); show a reminder/notice when
  data was last updated or is due for a refresh.
- **Open question, needs research before the backend is built:** does LEA
  expose a public feed/API, or would this require scraping / manual
  ingestion? This decides a lot of the backend design below.

### 5. Main page layout

Top to bottom:

1. Search bar (with filters, see above)
2. Fuel-type quick icons below the search bar: **D** (Diesel), **95**
   (A95), **LPG**
3. Map view
4. List of stations below the map, sorted by fuel price
5. Bottom navigation / sections: **Prices**, **Cities**, **Fuel
   calculator**, **Profile**

### 6. Fuel calculator

- Details TBD — likely estimates trip cost or savings from distance, fuel
  type/consumption, and current prices.

### 7. Profile

- Details TBD — likely holds favorites, notification preferences, and
  account settings.

## Technical implications

- **Backend needed**: accounts/auth, favorites storage, notification
  dispatch (web push and/or native), geolocation-aware querying.
- **Real data pipeline**: ingest LEA data on a schedule, store price
  history (required to detect "price changed" and trigger alerts).
- **Map provider**: needs a decision — cost and Lithuania coverage matter
  (e.g. Mapbox, Google Maps, or OpenStreetMap + Leaflet/MapLibre).
- **Platform**: PWA (extend the current Next.js app with a manifest + web
  push) vs. a native app (React Native/Flutter). PWA is the natural
  extension of the current stack and skips app-store overhead; native
  buys richer push/location behavior at the cost of a second codebase.

## Suggested build order

1. Research the LEA data source — this gates almost everything else.
2. Add the search/filters UI and station list to the current site using
   the existing sample data (no accounts/notifications yet).
3. Add map + geolocation "find nearest" on top of that.
4. Add accounts, favorites, and price-change alerts once real data with
   history exists to alert on.
5. Fuel calculator and profile page.

## Open questions

- Does LEA provide a usable public feed, and how often is it actually
  updated in practice?
- Native app or PWA — or both eventually?
- What counts as "nearby" when geolocation is denied — city-only fallback?
- Should route-based search use a routing API (e.g. driving directions) or
  a simpler straight-line corridor between two points?
