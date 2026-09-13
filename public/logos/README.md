# Station brand logos

Drop logo files directly in this folder (`public/logos/`). Each file must
be named exactly `<slug>.png` (square image, transparent background
recommended, ~128×128px is plenty since it's shown at ~28px on the map).
The slug is generated from the company name in `src/lib/slug.ts` —
lowercase, diacritics stripped, non-letters/digits collapsed to hyphens.

Missing logos degrade gracefully (the marker just shows the price badge
with no logo circle), so upload however many you can find — there's no
need to source all of them before this works.

## Priority list (by station count, full 741-station dataset)

Only the top ~15 cover the large majority of stations — start there.

| Stations | Filename | Company |
|---|---|---|
| 133 | `viada-lt.png` | Viada LT |
| 92 | `baltic-petroleum.png` | Baltic Petroleum |
| 92 | `circle-k-lietuva.png` | Circle K Lietuva |
| 85 | `neste-lietuva.png` | Neste Lietuva |
| 50 | `emsi.png` | Emsi |
| 31 | `saurida.png` | Saurida |
| 30 | `orlen-baltics-retail.png` | Orlen Baltics Retail |
| 27 | `alausa.png` | Alauša |
| 26 | `jozita.png` | Jozita |
| 25 | `eniris.png` | Eniris |
| 13 | `stateta.png` | Stateta |
| 12 | `trevena.png` | Trevena |
| 10 | `gelvybe.png` | Gelvybė |
| 9 | `apsaga.png` | Apsaga |
| 8 | `boost-petrol.png` | Boost Petrol |
| 7 | `skulas.png` | Skulas |
| 6 | `narjanta.png` | Narjanta |
| 5 | `regusa.png` | Regusa |
| 5 | `s-savicko-imone.png` | S.Savicko įmonė |
| 4 | `eu-verslas.png` | EU Verslas |
| 4 | `naftrus.png` | Naftrus |

The rest are 1–3 station local/regional operators — worth adding if you
find them, but low priority. Re-run
`node -e "..."` (see chat history) or ask to regenerate this full list
if the dataset changes.
