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
  agentūra, ena.lt) — confirmed this is also where competing sites
  (degalu-kaina.lt and others) source their data from.
- Data refreshes on a set day (e.g. Monday); show a reminder/notice when
  data was last updated or is due for a refresh.
- **Research findings (2026-09-12):**
  - Fuel retailers are legally required to report prices to LEA every
    working day by 10:00, with voluntary real-time updates after 11:00.
    No weekend updates — matches the "data updated on Monday" reminder
    idea.
  - LEA has no public REST API or open-data-portal dataset (checked
    data.gov.lt — no fuel price dataset listed there).
  - LEA does publish a **raw data Excel file**, consolidated by year, at
    [ena.lt/dk-pr-pr-duomenys](https://www.ena.lt/dk-pr-pr-duomenys/)
    ("Pranešimai ir pradiniai duomenys"). The current file is hosted as
    a SharePoint share link, which redirects to an Office web viewer —
    it's built for a person clicking "download" in a browser, not for
    unattended scripts. A scraper would need to either drive a headless
    browser through that flow or find a stable direct-download URL
    (worth testing SharePoint's `?download=1` pattern), and re-locate
    the link periodically since it looks like LEA rotates to a new file
    per period.
  - LEA also runs two visualization tools with no visible export: the
    [price map](https://www.ena.lt/dk-zemelapis/) (degalukainos.ena.lt)
    and the [monitoring tool](https://www.ena.lt/dk-irankis/). Both
    likely call an internal JSON API under the hood to render — that
    API isn't documented, but inspecting it via browser dev tools
    (Network tab) could turn up a cleaner, near-real-time source than
    the Excel file. Worth a follow-up session with an actual browser.
  - Competitor sites (e.g. degalu-kaina.lt) reportedly re-publish their
    own derived CSV/JSON exports built on top of LEA's data — not a
    primary source, and scraping a competitor's derived product raises
    its own legal/ethical questions, so treat this as a fallback idea
    only, not a plan.
- **Recommendation:** build the ingestion pipeline around the LEA Excel
  file first (most durable, explicitly "raw data"), and spend a short
  follow-up investigating whether the price-map tool's backend API is
  usable — that would remove the SharePoint/Excel fragility entirely.

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
- **Map provider**: decided — Leaflet + OpenStreetMap tiles (free, no API
  key). Shipped on `/kainos` (`src/components/StationMap.tsx`) with
  price-badge markers, a cheapest-price highlight, and per-station
  popups; station coordinates in `src/lib/data.ts` are approximate
  (placed by street/city, not geocoded) — replace with real geocoding
  once live station data is connected.
- **Platform**: PWA (extend the current Next.js app with a manifest + web
  push) vs. a native app (React Native/Flutter). PWA is the natural
  extension of the current stack and skips app-store overhead; native
  buys richer push/location behavior at the cost of a second codebase.

## Suggested build order

1. ~~Research the LEA data source~~ — done, see Data source above.
   Follow-up: inspect the price-map tool's network calls for a cleaner
   API before committing to Excel scraping.
2. Add the search/filters UI and station list to the current site using
   the existing sample data (no accounts/notifications yet).
3. Add map + geolocation "find nearest" on top of that.
4. Add accounts, favorites, and price-change alerts once real data with
   history exists to alert on.
5. Fuel calculator and profile page.

## Open questions

- Does the LEA price-map tool (degalukainos.ena.lt) call an internal API
  that's cleaner to consume than the Excel file? Needs a browser
  dev-tools session to check.
- How reliable is the SharePoint Excel link long-term — does LEA keep the
  same URL, or does it need to be re-discovered each time they rotate to
  a new period's file?
- Native app or PWA — or both eventually?
- What counts as "nearby" when geolocation is denied — city-only fallback?
- Should route-based search use a routing API (e.g. driving directions) or
  a simpler straight-line corridor between two points?
