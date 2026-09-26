# Backend sync pack for Full Brief Reimplementation (P0–P2)

This cloud agent only had write access to `bullbrief-frontend`. Apply these files into `bullbrief-backend` on branch `cj/full-brief-reimplementation-0663`:

1. Copy `utils/*` → backend `utils/`
2. Copy `routes/*` → backend `routes/`
3. Delete backend `routes/insight.py` (gpt-4 peer insight removed)
4. Commit/push from a credential that can write `bullbrief-backend`

Explore sectors (`GET /explore/sectors`) is included:

- `utils/explore_sectors.py` — pure selection
- `routes/explore.py` — FMP company screener, 12-hour cache, static basket when the key is missing or a sector is thin
- `routes/__init__.py` registers `explore_bp`
- `routes/peers.py` now returns `source` (`fmp`, `curated`, or `sector_static`)

The frontend also serves the same lists from `app/api/explore/sectors` so Explore works before this pack is copied. Set `FMP_API_KEY` for live market-cap lists. Without it, every sector uses the hand basket. Optional `EXPLORE_TICKERS_JSON` points the Flask route at a ticker catalog (`public/tickers.json` shape).

Local commit already exists at `/tmp/bullbrief-backend` on branch `cj/full-brief-reimplementation-0663` (commit e8d9c1b) if you can push that clone.
