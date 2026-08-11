from __future__ import annotations

import json
import math
import os
from statistics import mean
from typing import Any

from flask import Blueprint, jsonify
from openai import OpenAI
import requests
import yfinance as yf

from utils.scoring_pillars import build_pillars

try:
    from routes.revenue_breakdown import _extract_fmp_product_segments
except Exception:  # pragma: no cover
    _extract_fmp_product_segments = None


analyst_bp = Blueprint("analyst", __name__)
client = OpenAI()

FMP_API_KEY = os.getenv("FMP_API_KEY")

# Legacy static maps — used only as fallback when FMP peers fail
SECTOR_PEERS = {
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

INDUSTRY_PEERS = {
    "auto": ["TSLA", "TM", "GM", "F", "RIVN"],
    "semiconductor": ["NVDA", "AMD", "AVGO", "QCOM", "INTC", "TSM"],
    "software": ["MSFT", "ORCL", "CRM", "ADBE", "NOW", "SNOW"],
    "internet content": ["GOOGL", "META", "NFLX", "PINS", "SNAP"],
    "banks": ["JPM", "BAC", "WFC", "C", "GS", "MS"],
    "drug": ["LLY", "JNJ", "MRK", "ABBV", "PFE", "BMY"],
    "retail": ["AMZN", "WMT", "COST", "HD", "TGT", "LOW"],
}


def safe(value: Any) -> float | None:
    try:
        if value is None:
            return None
        number = float(value)
        if not math.isfinite(number):
            return None
        return round(number, 6)
    except (TypeError, ValueError):
        return None


def pct(value: float | None) -> str:
    return "N/A" if value is None else f"{value * 100:.1f}%"


def money(value: float | None) -> str:
    if value is None:
        return "N/A"
    abs_value = abs(value)
    sign = "-" if value < 0 else ""
    if abs_value >= 1e12:
        return f"{sign}${abs_value / 1e12:.2f}T"
    if abs_value >= 1e9:
        return f"{sign}${abs_value / 1e9:.2f}B"
    if abs_value >= 1e6:
        return f"{sign}${abs_value / 1e6:.1f}M"
    return f"{sign}${abs_value:,.0f}"


def ratio(value: float | None) -> str:
    return "N/A" if value is None else f"{value:.2f}x"


def _row_value(frame, names: list[str], column) -> float | None:
    for name in names:
        if name in frame.index:
            return safe(frame.loc[name, column])
    return None


def extract_statement_trends(stock: yf.Ticker) -> dict[str, Any]:
    trends: dict[str, Any] = {
        "revenue_latest": None,
        "revenue_growth_statement": None,
        "earnings_growth_statement": None,
        "margin_trend": None,
        "profit_margin_latest": None,
        "gross_margin_prior": None,
        "roa_prior": None,
        "debt_to_equity_prior": None,
        "current_ratio_prior": None,
        "shares_outstanding_prior": None,
        "asset_turnover_prior": None,
        "net_income": None,
        "operating_income": None,
        "total_assets": None,
        "current_assets": None,
        "current_liabilities": None,
        "retained_earnings": None,
        "total_liabilities": None,
        "book_value": None,
        "asset_turnover": None,
        "ebit": None,
    }
    try:
        statement = stock.income_stmt
        if statement is not None and not statement.empty and len(statement.columns) >= 1:
            latest_col = statement.columns[0]
            prior_col = statement.columns[1] if len(statement.columns) > 1 else None

            revenue_latest = _row_value(statement, ["Total Revenue", "Operating Revenue"], latest_col)
            income_latest = _row_value(statement, ["Net Income", "Net Income Common Stockholders"], latest_col)
            operating_income = _row_value(statement, ["Operating Income", "EBIT"], latest_col)
            ebit = _row_value(statement, ["EBIT", "Operating Income"], latest_col)
            gross_profit = _row_value(statement, ["Gross Profit"], latest_col)

            trends["revenue_latest"] = revenue_latest
            trends["net_income"] = income_latest
            trends["operating_income"] = operating_income
            trends["ebit"] = ebit

            if revenue_latest not in (None, 0) and income_latest is not None:
                trends["profit_margin_latest"] = income_latest / revenue_latest
            if revenue_latest not in (None, 0) and gross_profit is not None:
                trends["gross_margin_latest"] = gross_profit / revenue_latest

            if prior_col is not None:
                revenue_prior = _row_value(statement, ["Total Revenue", "Operating Revenue"], prior_col)
                income_prior = _row_value(statement, ["Net Income", "Net Income Common Stockholders"], prior_col)
                gross_prior = _row_value(statement, ["Gross Profit"], prior_col)
                if revenue_latest is not None and revenue_prior not in (None, 0):
                    trends["revenue_growth_statement"] = (revenue_latest - revenue_prior) / abs(revenue_prior)
                if income_latest is not None and income_prior not in (None, 0):
                    trends["earnings_growth_statement"] = (income_latest - income_prior) / abs(income_prior)
                if revenue_prior not in (None, 0) and income_prior is not None and revenue_latest not in (None, 0):
                    latest_margin = income_latest / revenue_latest if income_latest is not None else None
                    prior_margin = income_prior / revenue_prior
                    if latest_margin is not None:
                        trends["margin_trend"] = latest_margin - prior_margin
                if revenue_prior not in (None, 0) and gross_prior is not None:
                    trends["gross_margin_prior"] = gross_prior / revenue_prior

        balance = stock.balance_sheet
        if balance is not None and not balance.empty and len(balance.columns) >= 1:
            latest_col = balance.columns[0]
            prior_col = balance.columns[1] if len(balance.columns) > 1 else None

            total_assets = _row_value(balance, ["Total Assets"], latest_col)
            current_assets = _row_value(
                balance,
                ["Current Assets", "Total Current Assets As Reported"],
                latest_col,
            )
            current_liab = _row_value(
                balance,
                ["Current Liabilities", "Total Current Liabilities Net"],
                latest_col,
            )
            retained = _row_value(balance, ["Retained Earnings"], latest_col)
            total_liab = _row_value(balance, ["Total Liabilities Net Minority Interest", "Total Liabilities"], latest_col)
            equity = _row_value(
                balance,
                ["Stockholders Equity", "Common Stock Equity", "Total Equity Gross Minority Interest"],
                latest_col,
            )
            shares = _row_value(balance, ["Ordinary Shares Number", "Share Issued"], latest_col)
            total_debt = _row_value(balance, ["Total Debt"], latest_col)

            trends["total_assets"] = total_assets
            trends["current_assets"] = current_assets
            trends["current_liabilities"] = current_liab
            trends["retained_earnings"] = retained
            trends["total_liabilities"] = total_liab
            trends["book_value"] = equity
            if shares is not None:
                trends["shares_outstanding"] = shares
            if total_assets not in (None, 0) and trends.get("revenue_latest") is not None:
                trends["asset_turnover"] = trends["revenue_latest"] / total_assets
            if equity not in (None, 0) and total_debt is not None:
                trends["debt_to_equity_bs"] = (total_debt / equity) * 100

            if prior_col is not None:
                assets_prior = _row_value(balance, ["Total Assets"], prior_col)
                equity_prior = _row_value(
                    balance,
                    ["Stockholders Equity", "Common Stock Equity", "Total Equity Gross Minority Interest"],
                    prior_col,
                )
                debt_prior = _row_value(balance, ["Total Debt"], prior_col)
                ca_prior = _row_value(balance, ["Current Assets", "Total Current Assets As Reported"], prior_col)
                cl_prior = _row_value(balance, ["Current Liabilities", "Total Current Liabilities Net"], prior_col)
                shares_prior = _row_value(balance, ["Ordinary Shares Number", "Share Issued"], prior_col)
                ni_prior = None
                if statement is not None and not statement.empty and len(statement.columns) > 1:
                    ni_prior = _row_value(
                        statement,
                        ["Net Income", "Net Income Common Stockholders"],
                        statement.columns[1],
                    )
                rev_prior = None
                if statement is not None and not statement.empty and len(statement.columns) > 1:
                    rev_prior = _row_value(
                        statement,
                        ["Total Revenue", "Operating Revenue"],
                        statement.columns[1],
                    )

                if assets_prior not in (None, 0) and ni_prior is not None:
                    trends["roa_prior"] = ni_prior / assets_prior
                if equity_prior not in (None, 0) and debt_prior is not None:
                    trends["debt_to_equity_prior"] = (debt_prior / equity_prior) * 100
                if ca_prior is not None and cl_prior not in (None, 0):
                    trends["current_ratio_prior"] = ca_prior / cl_prior
                if shares_prior is not None:
                    trends["shares_outstanding_prior"] = shares_prior
                if assets_prior not in (None, 0) and rev_prior is not None:
                    trends["asset_turnover_prior"] = rev_prior / assets_prior
    except Exception:
        return trends

    return trends


def price_momentum(stock: yf.Ticker, current_price: float | None) -> dict[str, float | None]:
    result = {"one_year_return": None, "six_month_return": None}
    try:
        hist = stock.history(period="1y", interval="1d")
        if hist is None or hist.empty:
            return result
        closes = hist["Close"].dropna()
        if closes.empty:
            return result
        latest = safe(current_price) or safe(closes.iloc[-1])
        first = safe(closes.iloc[0])
        if latest is not None and first not in (None, 0):
            result["one_year_return"] = (latest - first) / abs(first)
        if len(closes) > 126:
            six_month = safe(closes.iloc[-126])
            if latest is not None and six_month not in (None, 0):
                result["six_month_return"] = (latest - six_month) / abs(six_month)
    except Exception:
        return result
    return result


def build_metrics(ticker: str, info: dict[str, Any], stock: yf.Ticker | None = None) -> dict[str, Any]:
    stock = stock or yf.Ticker(ticker)
    trends = extract_statement_trends(stock)
    momentum = price_momentum(stock, safe(info.get("currentPrice")))

    revenue = safe(info.get("totalRevenue")) or trends.get("revenue_latest")
    fcf = safe(info.get("freeCashflow"))
    market_cap = safe(info.get("marketCap"))
    enterprise_value = safe(info.get("enterpriseValue"))
    ebitda = safe(info.get("ebitda"))
    operating_margins = safe(info.get("operatingMargins"))

    fcf_yield = (fcf / market_cap) if fcf is not None and market_cap not in (None, 0) else None
    ev_ebitda = (enterprise_value / ebitda) if enterprise_value is not None and ebitda not in (None, 0) else None

    return {
        "ticker": ticker.upper(),
        "company_name": info.get("longName") or info.get("shortName") or ticker.upper(),
        "sector": info.get("sector") or "Unknown",
        "industry": info.get("industry") or "Unknown",
        "business_summary": info.get("longBusinessSummary") or "",
        "current_price": safe(info.get("currentPrice")),
        "market_cap": market_cap,
        "pe_ratio": safe(info.get("trailingPE")),
        "forward_pe": safe(info.get("forwardPE")),
        "peg_ratio": safe(info.get("pegRatio")),
        "price_to_book": safe(info.get("priceToBook")),
        "price_to_sales": safe(info.get("priceToSalesTrailing12Months")),
        "eps_ttm": safe(info.get("trailingEps")),
        "eps_forward": safe(info.get("forwardEps")),
        "revenue": revenue,
        "revenue_growth": safe(info.get("revenueGrowth"))
        if safe(info.get("revenueGrowth")) is not None
        else trends.get("revenue_growth_statement"),
        "earnings_growth": safe(info.get("earningsGrowth"))
        if safe(info.get("earningsGrowth")) is not None
        else trends.get("earnings_growth_statement"),
        "gross_margin": safe(info.get("grossMargins")) or trends.get("gross_margin_latest"),
        "operating_margin": operating_margins,
        "profit_margin": safe(info.get("profitMargins"))
        if safe(info.get("profitMargins")) is not None
        else trends.get("profit_margin_latest"),
        "margin_trend": trends.get("margin_trend"),
        "roe": safe(info.get("returnOnEquity")),
        "roa": safe(info.get("returnOnAssets")),
        "debt_to_equity": safe(info.get("debtToEquity")) or trends.get("debt_to_equity_bs"),
        "current_ratio": safe(info.get("currentRatio")),
        "total_cash": safe(info.get("totalCash")),
        "total_debt": safe(info.get("totalDebt")),
        "free_cashflow": fcf,
        "fcf_yield": fcf_yield,
        "operating_cashflow": safe(info.get("operatingCashflow")),
        "enterprise_value": enterprise_value,
        "ebitda": ebitda,
        "ev_ebitda": ev_ebitda,
        "beta": safe(info.get("beta")),
        "dividend_yield": safe(info.get("dividendYield")),
        "short_percent_float": safe(info.get("shortPercentOfFloat")),
        "institutional_ownership": safe(info.get("heldPercentInstitutions")),
        "wk52_low": safe(info.get("fiftyTwoWeekLow")),
        "wk52_high": safe(info.get("fiftyTwoWeekHigh")),
        "target_mean_price": safe(info.get("targetMeanPrice")),
        "recommendation_key": info.get("recommendationKey"),
        "recommendation_mean": safe(info.get("recommendationMean")),
        "analyst_count": info.get("numberOfAnalystOpinions"),
        "one_year_return": momentum.get("one_year_return"),
        "six_month_return": momentum.get("six_month_return"),
        "net_income": trends.get("net_income"),
        "operating_income": trends.get("operating_income"),
        "ebit": trends.get("ebit"),
        "total_assets": trends.get("total_assets"),
        "current_assets": trends.get("current_assets"),
        "current_liabilities": trends.get("current_liabilities"),
        "retained_earnings": trends.get("retained_earnings"),
        "total_liabilities": trends.get("total_liabilities"),
        "book_value": trends.get("book_value"),
        "asset_turnover": trends.get("asset_turnover"),
        "shares_outstanding": safe(info.get("sharesOutstanding")) or trends.get("shares_outstanding"),
        "_trends": trends,
    }


def build_peer_metrics(ticker: str, info: dict[str, Any]) -> dict[str, Any]:
    market_cap = safe(info.get("marketCap"))
    fcf = safe(info.get("freeCashflow"))
    return {
        "ticker": ticker.upper(),
        "company_name": info.get("longName") or info.get("shortName") or ticker.upper(),
        "sector": info.get("sector") or "Unknown",
        "industry": info.get("industry") or "Unknown",
        "market_cap": market_cap,
        "revenue_growth": safe(info.get("revenueGrowth")),
        "profit_margin": safe(info.get("profitMargins")),
        "gross_margin": safe(info.get("grossMargins")),
        "pe_ratio": safe(info.get("trailingPE")),
        "forward_pe": safe(info.get("forwardPE")),
        "peg_ratio": safe(info.get("pegRatio")),
        "price_to_sales": safe(info.get("priceToSalesTrailing12Months")),
        "free_cashflow": fcf,
        "fcf_yield": (fcf / market_cap) if fcf is not None and market_cap not in (None, 0) else None,
    }


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
                        sym = item.get("symbol") or item.get("ticker")
                        if sym:
                            symbols.append(str(sym).upper())
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


def fallback_peer_candidates(ticker: str, sector: str, industry: str) -> list[str]:
    from routes.peers import peer_map

    candidates = list(peer_map.get(ticker.upper(), []))
    lowered = (industry or "").lower()
    for key, symbols in INDUSTRY_PEERS.items():
        if key in lowered:
            candidates.extend(symbols)
    candidates.extend(SECTOR_PEERS.get(sector, []))
    deduped = []
    for symbol in candidates:
        symbol = symbol.upper()
        if symbol == ticker.upper() or symbol in deduped:
            continue
        deduped.append(symbol)
    return deduped[:12]


def fetch_peer_metrics(ticker: str, target: dict[str, Any]) -> list[dict[str, Any]]:
    """Cap-banded peers: keep only 0.25x–4x market cap, nearest 5 by cap proximity."""
    target_cap = target.get("market_cap")
    symbols = fetch_fmp_peer_symbols(ticker)
    if not symbols:
        symbols = fallback_peer_candidates(ticker, target.get("sector", ""), target.get("industry", ""))

    peers = []
    for symbol in symbols:
        try:
            info = yf.Ticker(symbol).info
            if not info or not info.get("shortName"):
                continue
            metrics = build_peer_metrics(symbol, info)
            peer_cap = metrics.get("market_cap")
            if peer_cap is None:
                continue
            if target_cap:
                ratio_to_target = peer_cap / target_cap
                if ratio_to_target < 0.25 or ratio_to_target > 4.0:
                    continue
            peers.append(metrics)
        except Exception:
            continue

    if target_cap:
        peers.sort(key=lambda item: abs((item.get("market_cap") or 0) - target_cap))
    else:
        peers.sort(key=lambda item: item.get("market_cap") or 0, reverse=True)
    return peers[:5]


def segment_context(ticker: str) -> dict[str, Any] | None:
    if _extract_fmp_product_segments is None:
        return None
    try:
        data = _extract_fmp_product_segments(ticker)
    except Exception:
        return None
    if not data or not data.get("years"):
        return None
    latest = data["years"][-1]
    total = latest.get("total") or 0
    segments = []
    for name, value in latest.get("breakdown", {}).items():
        if not value:
            continue
        share = value / total if total else None
        segments.append({"name": name, "value": value, "share": share})
    segments.sort(key=lambda item: item.get("value") or 0, reverse=True)
    return {
        "source": data.get("source_name"),
        "latest_year": latest.get("year"),
        "latest_total": total,
        "latest_segments": segments[:8],
        "top_segment_share": segments[0]["share"] if segments else None,
    }


def metric_snapshot(metrics: dict[str, Any]) -> dict[str, str]:
    return {
        "Revenue": money(metrics.get("revenue")),
        "Revenue growth": pct(metrics.get("revenue_growth")),
        "Gross margin": pct(metrics.get("gross_margin")),
        "Operating margin": pct(metrics.get("operating_margin")),
        "Profit margin": pct(metrics.get("profit_margin")),
        "P/E": ratio(metrics.get("pe_ratio")),
        "Forward P/E": ratio(metrics.get("forward_pe")),
        "P/S": ratio(metrics.get("price_to_sales")),
        "FCF yield": pct(metrics.get("fcf_yield")),
        "EV/EBITDA": ratio(metrics.get("ev_ebitda")),
        "Debt/Equity": ratio(metrics.get("debt_to_equity")),
        "Free cash flow": money(metrics.get("free_cashflow")),
        "ROA": pct(metrics.get("roa")),
        "ROE": pct(metrics.get("roe")),
    }


def compact_peer(peer: dict[str, Any]) -> dict[str, Any]:
    return {
        "company": peer.get("company_name"),
        "ticker": peer.get("ticker"),
        "market_cap": money(peer.get("market_cap")),
        "revenue_growth": pct(peer.get("revenue_growth")),
        "profit_margin": pct(peer.get("profit_margin")),
        "forward_pe": ratio(peer.get("forward_pe")),
        "price_to_sales": ratio(peer.get("price_to_sales")),
        "fcf_yield": pct(peer.get("fcf_yield")),
    }


def fallback_report(
    metrics: dict[str, Any],
    peers: list[dict[str, Any]],
    pillars: dict[str, Any],
    segments: dict[str, Any] | None,
    risk_factors: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    signal = pillars["signal"]
    piotroski = pillars["piotroski"]
    altman = pillars["altman"]
    valuation = pillars["valuation"]

    summary = (
        f"{metrics['company_name']} screens as {signal['overall_signal'].lower()} on BullBrief's "
        f"pillar model (schema market-signal-v5). Piotroski {piotroski.get('display')}, "
        f"Altman band {altman.get('band') or 'n/a'}, valuation label {valuation.get('label')} "
        f"(composite percentile {valuation.get('composite_percentile')}). "
        f"Coverage {signal.get('coverage'):.0%}. Missing fields are uncertainty, not neutral evidence."
    )

    return {
        "schema": "market-signal-v5",
        "overall_signal": signal["overall_signal"],
        "signal_label": signal["signal_label"],
        "confidence": signal["confidence"],
        "coverage": signal["coverage"],
        "summary": summary,
        "why_signal_appears": signal.get("reasons")
        or [
            f"Piotroski checklist at {piotroski.get('display')}.",
            f"Altman Z″ band: {altman.get('band') or altman.get('skipped_reason')}.",
            f"Relative valuation label: {valuation.get('label')}.",
        ],
        "what_could_change_signal": [
            "A sustained change in profitability or cash-flow quality would move the F-Score.",
            "Balance-sheet stress or relief would move the Altman band.",
            "Peer-relative multiple compression or expansion would move valuation percentiles.",
        ],
        "pillars": pillars,
        "peers": [compact_peer(peer) for peer in peers[:5]],
        "risk_factors": risk_factors or [],
        "uncertainty": [
            "Some financial fields may be missing from Yahoo Finance or delayed.",
            "Pillar math uses best-available public data; approximations are labeled in evidence.",
        ],
        "disclaimer": "This is an AI-generated research summary for educational purposes only. It is not financial advice.",
    }


def build_prompt(
    metrics: dict[str, Any],
    peers: list[dict[str, Any]],
    pillars: dict[str, Any],
    segments: dict[str, Any] | None,
    risk_factors: list[dict[str, Any]] | None = None,
) -> str:
    signal = pillars["signal"]
    return f"""
Create a short educational research snapshot for {metrics['company_name']} ({metrics['ticker']}).

This is a market signal summary, not a recommendation. Never say buy, sell, or hold.
Use the locked signal exactly:
- overall_signal: {signal['overall_signal']}
- signal_label: {signal['signal_label']}
- confidence: {signal['confidence']}
- coverage: {signal['coverage']}

Locked pillars (do not invent different scores):
{json.dumps({
    "piotroski": {"display": pillars["piotroski"].get("display"), "score": pillars["piotroski"].get("score"), "max_score": pillars["piotroski"].get("max_score")},
    "altman": {"band": pillars["altman"].get("band"), "z": pillars["altman"].get("z"), "applicable": pillars["altman"].get("applicable"), "skipped_reason": pillars["altman"].get("skipped_reason")},
    "valuation": {"label": pillars["valuation"].get("label"), "composite_percentile": pillars["valuation"].get("composite_percentile")},
    "reasons": signal.get("reasons"),
}, indent=2)}

Company facts:
{json.dumps(metric_snapshot(metrics), indent=2)}

Peer metrics (no moat language — metrics only):
{json.dumps([compact_peer(peer) for peer in peers], indent=2)}

SEC risk factors (if any):
{json.dumps(risk_factors or [], indent=2)}

Segment context if available:
{json.dumps(segments, indent=2, default=str)}

Return VALID JSON ONLY:
{{
  "summary": "<one balanced paragraph explaining the pillar setup without advice>",
  "why_signal_appears": ["<reason tied to pillars>", "<reason>", "<reason>"],
  "what_could_change_signal": ["<change>", "<change>", "<change>"],
  "uncertainty": ["<data gap>", "<data gap>"]
}}

Rules:
- Do not change overall_signal, signal_label, confidence, or pillar numbers.
- If data is missing, say it is missing.
- No hype. Keep bullets specific and concise.
"""


def ensure_report_shape(
    report: dict[str, Any],
    metrics: dict[str, Any],
    peers: list[dict[str, Any]],
    pillars: dict[str, Any],
    segments: dict[str, Any] | None,
    risk_factors: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    fallback = fallback_report(metrics, peers, pillars, segments, risk_factors)
    clean = {**fallback, **{k: v for k, v in report.items() if v not in (None, "", [], {})}}

    signal = pillars["signal"]
    clean["schema"] = "market-signal-v5"
    clean["overall_signal"] = signal["overall_signal"]
    clean["signal_label"] = signal["signal_label"]
    clean["confidence"] = signal["confidence"]
    clean["coverage"] = signal["coverage"]
    clean["pillars"] = pillars
    clean["peers"] = [compact_peer(peer) for peer in peers[:5]]
    clean["risk_factors"] = risk_factors or clean.get("risk_factors") or []
    clean["disclaimer"] = (
        "This is an AI-generated research summary for educational purposes only. It is not financial advice."
    )

    # Strip legacy / high-cost narrative fields if model returns them
    for key in (
        "scorecard",
        "competitive_analysis",
        "bull_case",
        "bear_case",
        "stock_drivers",
        "key_upside_drivers",
        "key_downside_risks",
    ):
        clean.pop(key, None)

    return clean


def _try_load_sec_risks(ticker: str) -> list[dict[str, Any]]:
    """Best-effort: reuse drivers endpoint logic if already warm; otherwise empty."""
    try:
        from routes.drivers import extract_risk_factors_only

        return extract_risk_factors_only(ticker) or []
    except Exception:
        return []


@analyst_bp.route("/analyst/<ticker>")
def get_analyst_report(ticker):
    try:
        symbol = ticker.upper()
        stock = yf.Ticker(symbol)
        info = stock.info

        if not info or "shortName" not in info:
            return jsonify({"error": "Invalid ticker"}), 400

        metrics = build_metrics(symbol, info, stock)
        trends = metrics.pop("_trends", {})
        peers = fetch_peer_metrics(symbol, metrics)
        segments = segment_context(symbol)
        pillars = build_pillars(metrics, peers, trends)
        risk_factors = _try_load_sec_risks(symbol)

        prompt = build_prompt(metrics, peers, pillars, segments, risk_factors)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You produce balanced, educational equity research snapshots. "
                        "You never give investment advice, never tell users to buy or sell, "
                        "and you respond with valid JSON only. You never invent pillar scores."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.2,
            max_tokens=800,
            response_format={"type": "json_object"},
        )

        generated = json.loads(response.choices[0].message.content)
        report = ensure_report_shape(generated, metrics, peers, pillars, segments, risk_factors)
        report.update(
            {
                "company_name": metrics["company_name"],
                "ticker": symbol,
                "sector": metrics["sector"],
                "industry": metrics["industry"],
                "current_price": metrics.get("current_price"),
                "market_cap": metrics.get("market_cap"),
                "wk52_low": metrics.get("wk52_low"),
                "wk52_high": metrics.get("wk52_high"),
                "metrics": metric_snapshot(metrics),
                "source": {
                    "market_data": "Yahoo Finance via yfinance",
                    "segment_data": segments.get("source") if segments else None,
                    "ai": "OpenAI",
                    "schema": "market-signal-v5",
                },
            }
        )
        return jsonify(report)

    except json.JSONDecodeError:
        try:
            symbol = ticker.upper()
            stock = yf.Ticker(symbol)
            info = stock.info
            metrics = build_metrics(symbol, info, stock)
            trends = metrics.pop("_trends", {})
            peers = fetch_peer_metrics(symbol, metrics)
            segments = segment_context(symbol)
            pillars = build_pillars(metrics, peers, trends)
            report = fallback_report(metrics, peers, pillars, segments)
            report.update(
                {
                    "company_name": metrics["company_name"],
                    "ticker": symbol,
                    "sector": metrics["sector"],
                    "industry": metrics["industry"],
                    "current_price": metrics.get("current_price"),
                    "market_cap": metrics.get("market_cap"),
                    "wk52_low": metrics.get("wk52_low"),
                    "wk52_high": metrics.get("wk52_high"),
                    "source": {"market_data": "Yahoo Finance via yfinance", "ai": "Fallback", "schema": "market-signal-v5"},
                }
            )
            return jsonify(report)
        except Exception as exc:
            return jsonify({"error": f"Failed to parse AI response: {str(exc)}"}), 500
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500
