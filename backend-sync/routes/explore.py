"""GET /explore/sectors — largest listed company in each of the 11 sectors.

Cached for 12 hours. A missing FMP key, or a thin screener result, fills that
sector from the hand basket and marks it static. No model call.
"""

from __future__ import annotations

import json
import os
import threading
import time
from pathlib import Path
from typing import Any

import requests
from flask import Blueprint, jsonify

from utils.explore_sectors import SECTORS, build_sector_lists

explore_bp = Blueprint("explore", __name__)

CACHE_TTL_SECONDS = 12 * 60 * 60
FMP_SCREENER = "https://financialmodelingprep.com/stable/company-screener"

_lock = threading.Lock()
_cached: dict[str, Any] | None = None
_cached_at = 0.0


def _catalog() -> tuple[set[str], dict[str, str]]:
    configured = os.getenv("EXPLORE_TICKERS_JSON")
    candidates = []
    if configured:
        candidates.append(Path(configured))
    candidates.append(Path(__file__).resolve().parents[2] / "public" / "tickers.json")
    universe: set[str] = set()
    names: dict[str, str] = {}
    for path in candidates:
        if not path.is_file():
            continue
        try:
            rows = json.loads(path.read_text())
        except (OSError, json.JSONDecodeError):
            continue
        if not isinstance(rows, list):
            continue
        for row in rows:
            if not isinstance(row, dict):
                continue
            symbol = str(row.get("symbol") or "").strip().upper()
            if not symbol:
                continue
            universe.add(symbol)
            name = row.get("name")
            if isinstance(name, str) and name.strip():
                names[symbol] = name.strip()
        if universe:
            break
    return universe, names


def _fetch_sector(fmp_sector: str) -> list[dict[str, Any]] | None:
    key = os.getenv("FMP_API_KEY")
    if not key:
        return None
    try:
        response = requests.get(
            FMP_SCREENER,
            params={
                "sector": fmp_sector,
                "limit": 40,
                "isActivelyTrading": "true",
                "apikey": key,
            },
            timeout=12,
        )
        if response.status_code != 200:
            return None
        body = response.json()
    except Exception:
        return None
    return body if isinstance(body, list) else None


def explore_payload() -> dict[str, Any]:
    global _cached, _cached_at
    now = time.time()
    with _lock:
        if _cached is not None and now - _cached_at < CACHE_TTL_SECONDS:
            return _cached
    universe, names = _catalog()
    fetched: dict[str, list[dict[str, Any]] | None] = {}
    for _label, _etf, fmp_sector in SECTORS:
        fetched[fmp_sector] = _fetch_sector(fmp_sector)
    payload = {"sectors": build_sector_lists(lambda name: fetched.get(name), universe, names)}
    with _lock:
        _cached = payload
        _cached_at = time.time()
    return payload


@explore_bp.route("/explore/sectors", methods=["GET"])
def explore_sectors():
    return jsonify(explore_payload())
