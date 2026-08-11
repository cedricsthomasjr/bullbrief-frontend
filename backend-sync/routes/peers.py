# peers.py — FMP peers with 0.25x–4x market-cap band filter

from __future__ import annotations

import os
from typing import Any

import requests
import yfinance as yf
from flask import Blueprint, jsonify

peers_bp = Blueprint("peers", __name__)

FMP_API_KEY = os.getenv("FMP_API_KEY")

# Static fallback when FMP is unavailable
peer_map = {
    "AAPL": ["MSFT", "GOOGL", "AMZN", "META", "NVDA"],
    "TSLA": ["F", "GM", "NIO", "RIVN", "LCID"],
    "JPM": ["BAC", "C", "WFC", "GS", "MS"],
}

SECTOR_FALLBACK = {
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


def get_metrics(ticker: str) -> dict[str, Any] | None:
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        if not info:
            return None
        market_cap = info.get("marketCap")
        fcf = info.get("freeCashflow")
        return {
            "ticker": ticker.upper(),
            "name": info.get("shortName", "N/A"),
            "company_name": info.get("longName") or info.get("shortName") or ticker.upper(),
            "market_cap": market_cap,
            "pe_ratio": info.get("trailingPE"),
            "forward_pe": info.get("forwardPE"),
            "peg_ratio": info.get("pegRatio"),
            "price_to_sales": info.get("priceToSalesTrailing12Months"),
            "profit_margin": info.get("profitMargins"),
            "free_cashflow": fcf,
            "fcf_yield": (fcf / market_cap) if fcf and market_cap else None,
            "sector": info.get("sector"),
            "industry": info.get("industry"),
        }
    except Exception as e:
        print(f"Error fetching {ticker}: {e}")
        return None


def fetch_fmp_peer_symbols(ticker: str) -> list[str]:
    if not FMP_API_KEY:
        return []
    urls = [
        f"https://financialmodelingprep.com/stable/stock-peers?symbol={ticker}&apikey={FMP_API_KEY}",
        f"https://financialmodelingprep.com/api/v4/stock_peers?symbol={ticker}&apikey={FMP_API_KEY}",
    ]
    for url in urls:
        try:
            res = requests.get(url, timeout=12)
            if res.status_code != 200:
                continue
            data = res.json()
            symbols: list[str] = []
            if isinstance(data, list):
                for item in data:
                    if isinstance(item, str):
                        symbols.append(item.upper())
                    elif isinstance(item, dict):
                        peers = item.get("peersList") or item.get("peers") or []
                        if isinstance(peers, list):
                            symbols.extend(str(p).upper() for p in peers)
            elif isinstance(data, dict):
                peers = data.get("peersList") or data.get("peers") or []
                if isinstance(peers, list):
                    symbols.extend(str(p).upper() for p in peers)
            deduped = []
            for symbol in symbols:
                if symbol and symbol != ticker.upper() and symbol not in deduped:
                    deduped.append(symbol)
            if deduped:
                return deduped[:20]
        except Exception:
            continue
    return []


def resolve_peer_symbols(ticker: str, sector: str | None) -> list[str]:
    symbols = fetch_fmp_peer_symbols(ticker)
    if symbols:
        return symbols
    symbols = list(peer_map.get(ticker.upper(), []))
    if sector:
        symbols.extend(SECTOR_FALLBACK.get(sector, []))
    deduped = []
    for symbol in symbols:
        symbol = symbol.upper()
        if symbol != ticker.upper() and symbol not in deduped:
            deduped.append(symbol)
    return deduped[:12]


def filter_cap_band(target_cap: float | None, peers: list[dict[str, Any]]) -> list[dict[str, Any]]:
    if not target_cap:
        return peers[:5]
    filtered = []
    for peer in peers:
        cap = peer.get("market_cap")
        if not cap:
            continue
        ratio = cap / target_cap
        if 0.25 <= ratio <= 4.0:
            filtered.append(peer)
    filtered.sort(key=lambda item: abs((item.get("market_cap") or 0) - target_cap))
    return filtered[:5]


@peers_bp.route("/compare/peers/<ticker>", methods=["GET"])
def compare_peers(ticker):
    ticker = ticker.upper()
    target_data = get_metrics(ticker)

    if not target_data or not target_data.get("market_cap"):
        return jsonify({"error": "Ticker not found or data incomplete"}), 404

    peer_tickers = resolve_peer_symbols(ticker, target_data.get("sector"))
    peers = []
    for pt in peer_tickers:
        data = get_metrics(pt)
        if data and data.get("market_cap"):
            peers.append(data)

    peers = filter_cap_band(target_data.get("market_cap"), peers)

    return jsonify(
        {
            "ticker": ticker,
            "target": target_data,
            "sector": target_data.get("sector"),
            "peers": peers,
            "filter": {"market_cap_band": "0.25x–4x", "limit": 5},
        }
    )
