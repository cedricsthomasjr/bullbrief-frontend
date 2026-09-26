# Explore

Public page at `/explore`. Data route: `GET /api/explore/sectors` (Next) and, in the backend pack, `GET /explore/sectors`.

The page is a directory of company groups. It does not rank a sector by price move, and it does not call a model.

| Zone | Source |
|---|---|
| Six landing tickers | `LANDING_TICKERS` in `app/lib/explore/sectors.ts` |
| Three Compare groups | `COMPARE_PRESETS` in the same file |
| 11 sector lists | FMP `/stable/company-screener`, or the hand basket in `SECTOR_PEERS` |

Live rows show market cap. Static rows do not. Copy lives in `app/lib/explore/copy.ts` and stays inside the no-advice vocabulary.

A Brief reads `GET /compare/peers/<ticker>` on the existing backend. The header shows three names. The Peers section shows up to six. `backend-sync/routes/peers.py` adds a `source` field so a sector-basket fill is labeled as companies in that sector. A response that predates `source` is treated as `fmp`.

## Limitation

The screener list is the largest names the provider returned that are also in `public/tickers.json`, after collapsing a second share class, held for 12 hours. It is not a full reconstitution of the sector index.
