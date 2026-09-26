"""Pure sector lists for Explore. No HTTP.

A live sector is the six largest screener rows that are also in the ticker
universe, after a second share class is dropped. A thin or failed sector is
replaced entirely by the hand basket.
"""

from __future__ import annotations

import math
import re
from typing import Any, Callable, Mapping

# GICS label, sector ETF, FMP screener sector. Fixed order, not a ranking.
SECTORS: list[tuple[str, str, str]] = [
    ("Technology", "XLK", "Technology"),
    ("Healthcare", "XLV", "Healthcare"),
    ("Financials", "XLF", "Financial Services"),
    ("Consumer Discretionary", "XLY", "Consumer Cyclical"),
    ("Consumer Staples", "XLP", "Consumer Defensive"),
    ("Industrials", "XLI", "Industrials"),
    ("Energy", "XLE", "Energy"),
    ("Utilities", "XLU", "Utilities"),
    ("Real Estate", "XLRE", "Real Estate"),
    ("Materials", "XLB", "Basic Materials"),
    ("Communication Services", "XLC", "Communication Services"),
]

SECTOR_PEERS: dict[str, list[str]] = {
    "Technology": ["MSFT", "AAPL", "NVDA", "GOOGL", "META", "AVGO", "ORCL"],
    "Communication Services": ["GOOGL", "META", "NFLX", "DIS", "TMUS", "VZ"],
    "Consumer Cyclical": ["AMZN", "TSLA", "HD", "MCD", "NKE", "SBUX"],
    "Consumer Defensive": ["WMT", "COST", "PG", "KO", "PEP", "MDLZ"],
    "Financial Services": ["JPM", "BAC", "WFC", "GS", "MS", "C"],
    "Healthcare": ["LLY", "UNH", "JNJ", "MRK", "ABBV", "TMO"],
    "Industrials": ["GE", "CAT", "HON", "UPS", "RTX", "DE"],
    "Energy": ["XOM", "CVX", "COP", "SLB", "EOG", "MPC"],
    "Basic Materials": ["LIN", "SHW", "FCX", "NEM", "APD", "ECL"],
    "Real Estate": ["PLD", "AMT", "EQIX", "WELL", "SPG", "O"],
    "Utilities": ["NEE", "SO", "DUK", "AEP", "SRE", "D"],
}

_SUFFIXES = (
    "class a",
    "class b",
    "class c",
    "corporation",
    "incorporated",
    "company",
    "inc",
    "corp",
    "ltd",
    "plc",
    "co",
)
_PUNCT = re.compile(r"[^a-z0-9\s]")
_SPACE = re.compile(r"\s+")


def normalize_company_name(name: str) -> str:
    text = _SPACE.sub(" ", _PUNCT.sub(" ", (name or "").lower())).strip()
    changed = True
    while changed and text:
        changed = False
        for suffix in _SUFFIXES:
            if text == suffix or text.endswith(f" {suffix}"):
                text = text[: -len(suffix)].strip()
                changed = True
                break
    return text


def _finite_cap(value: Any) -> float | None:
    if isinstance(value, bool) or not isinstance(value, (int, float, str)):
        return None
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    if not math.isfinite(number) or number <= 0:
        return None
    return number


def _flagged(value: Any) -> bool:
    return value is True or value in {"true", "True"}


def _symbol(row: Mapping[str, Any]) -> str:
    return str(row.get("symbol") or "").strip().upper()


def _name(row: Mapping[str, Any]) -> str:
    raw = row.get("companyName") or row.get("name") or ""
    return raw.strip() if isinstance(raw, str) else ""


def select_sector_companies(
    rows: list[Mapping[str, Any]],
    universe: set[str] | frozenset[str],
    limit: int = 6,
) -> list[dict[str, Any]]:
    ranked: list[dict[str, Any]] = []
    for row in rows:
        symbol = _symbol(row)
        market_cap = _finite_cap(row.get("marketCap") if "marketCap" in row else row.get("market_cap"))
        if not symbol or symbol not in universe or market_cap is None:
            continue
        if _flagged(row.get("isEtf")) or _flagged(row.get("isFund")):
            continue
        ranked.append({"symbol": symbol, "name": _name(row), "marketCap": market_cap})
    ranked.sort(key=lambda item: item["marketCap"], reverse=True)

    kept: list[dict[str, Any]] = []
    seen: set[str] = set()
    for row in ranked:
        key = normalize_company_name(row["name"])
        if key and key in seen:
            continue
        if key:
            seen.add(key)
        kept.append(row)
        if len(kept) >= limit:
            break
    return kept


def _static_companies(fmp_sector: str, names: Mapping[str, str]) -> list[dict[str, Any]]:
    return [
        {"symbol": symbol, "name": names.get(symbol) or symbol, "marketCap": None}
        for symbol in SECTOR_PEERS.get(fmp_sector, [])
    ]


def build_sector_lists(
    fetch_rows: Callable[[str], list[Mapping[str, Any]] | None],
    universe: set[str] | frozenset[str],
    names: Mapping[str, str],
) -> list[dict[str, Any]]:
    sectors: list[dict[str, Any]] = []
    for label, etf, fmp_sector in SECTORS:
        selected: list[dict[str, Any]] = []
        try:
            rows = fetch_rows(fmp_sector)
            if rows:
                selected = select_sector_companies(list(rows), universe)
        except Exception:
            selected = []
        if len(selected) < 6:
            sectors.append(
                {
                    "sector": label,
                    "sectorEtf": etf,
                    "source": "static",
                    "companies": _static_companies(fmp_sector, names),
                }
            )
            continue
        sectors.append(
            {
                "sector": label,
                "sectorEtf": etf,
                "source": "fmp",
                "companies": selected,
            }
        )
    return sectors
