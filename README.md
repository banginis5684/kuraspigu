# KuraSpigu.lt

Website to compare fuel prices (A95, A98, diesel, LPG) across fuel stations
in Lithuania, so drivers can find the cheapest station near them.

Built with [Next.js](https://nextjs.org) (App Router), TypeScript, and
Tailwind CSS.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

- `src/app/` — pages (landing, `/kainos` prices, `/apie-mus` about,
  `/kontaktai` contact, `/privatumo-politika` privacy policy,
  `/naudojimosi-taisykles` terms of use)
- `src/components/` — `Header`, `Footer`, `Logo`, `FuelPriceTable`
- `src/lib/data.ts` — fuel station data. **Currently sample/placeholder
  data** — replace `STATIONS` with a live feed (API, scraper, or manual
  entry) before relying on the site for real prices.

## Brand

- Style: black and white, minimal.
- Logo: a fuel-drop mark repeated in a star/radial pattern in black,
  brown, and yellow (`src/components/Logo.tsx`, static version at
  `public/favicon.svg`).

## Deploying

The app is a standard Next.js app and deploys to any Next.js-compatible
host (e.g. Vercel). Point the `kuraspigu.lt` domain's DNS at your chosen
host once deployed.

## Next steps

- Connect a real fuel price data source in `src/lib/data.ts`.
- Have the legal pages (`privatumo-politika`, `naudojimosi-taisykles`)
  reviewed by a lawyer before going live publicly.
- Wire up a working contact form (e.g. via Resend or a form service).
