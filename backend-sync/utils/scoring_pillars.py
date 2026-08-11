"""Transparent scoring pillars: Piotroski F-Score, Altman Z″, relative valuation."""

from __future__ import annotations

import math
import os
from typing import Any

import requests

FMP_API_KEY = os.getenv("FMP_API_KEY")
FINANCIAL_SECTORS = {"Financial Services", "Financials", "Banks", "Insurance"}
COVERAGE_THRESHOLD = 0.5


def _safe(value: Any) -> float | None:
    try:
        if value is None:
            return None
        number = float(value)
        if not math.isfinite(number):
            return None
        return float(number)
    except (TypeError, ValueError):
        return None


def _pct_rank(value: float | None, sample: list[float]) -> float | None:
    """Return percentile rank 0–100 (lower value = lower percentile)."""
    if value is None or not sample:
        return None
    sorted_sample = sorted(sample)
    below = sum(1 for item in sorted_sample if item < value)
    equal = sum(1 for item in sorted_sample if item == value)
    return round((below + 0.5 * equal) / len(sorted_sample) * 100, 1)


def _is_financial(sector: str | None, industry: str | None) -> bool:
    sector = sector or ""
    industry = (industry or "").lower()
    if sector in FINANCIAL_SECTORS:
        return True
    return any(token in industry for token in ("bank", "insurance", "capital market", "asset management"))


def compute_piotroski(metrics: dict[str, Any], trends: dict[str, Any] | None = None) -> dict[str, Any]:
    """
    Piotroski F-Score approximation from Yahoo/statement fields.
    Unavailable tests are excluded from both score and denominator.
    """
    trends = trends or {}
    tests: list[dict[str, Any]] = []

    def add(key: str, label: str, passed: bool | None, evidence: str, value: Any = None) -> None:
        tests.append(
            {
                "key": key,
                "label": label,
                "passed": passed,
                "available": passed is not None,
                "evidence": evidence,
                "value": value,
            }
        )

    net_income = _safe(metrics.get("net_income"))
    if net_income is None:
        profit_margin = _safe(metrics.get("profit_margin"))
        revenue = _safe(metrics.get("revenue"))
        if profit_margin is not None and revenue is not None:
            net_income = profit_margin * revenue

    ocf = _safe(metrics.get("operating_cashflow"))
    roa = _safe(metrics.get("roa"))
    roa_prior = _safe(trends.get("roa_prior"))
    debt = _safe(metrics.get("debt_to_equity"))
    debt_prior = _safe(trends.get("debt_to_equity_prior"))
    current = _safe(metrics.get("current_ratio"))
    current_prior = _safe(trends.get("current_ratio_prior"))
    shares = _safe(metrics.get("shares_outstanding"))
    shares_prior = _safe(trends.get("shares_outstanding_prior"))
    gross = _safe(metrics.get("gross_margin"))
    gross_prior = _safe(trends.get("gross_margin_prior"))
    asset_turnover = _safe(metrics.get("asset_turnover"))
    asset_turnover_prior = _safe(trends.get("asset_turnover_prior"))

    # 1. Positive net income / ROA
    if net_income is not None:
        add("positive_ni", "Positive net income", net_income > 0, f"Net income = {net_income:,.0f}", net_income)
    elif roa is not None:
        add("positive_roa", "Positive ROA", roa > 0, f"ROA = {roa:.2%}", roa)
    else:
        add("positive_ni", "Positive net income", None, "Net income / ROA unavailable")

    # 2. Positive operating cash flow
    if ocf is not None:
        add("positive_ocf", "Positive operating cash flow", ocf > 0, f"Operating cash flow = {ocf:,.0f}", ocf)
    else:
        add("positive_ocf", "Positive operating cash flow", None, "Operating cash flow unavailable")

    # 3. Cash flow > net income
    if ocf is not None and net_income is not None:
        add(
            "accrual",
            "Operating cash flow exceeds net income",
            ocf > net_income,
            f"OCF ({ocf:,.0f}) vs NI ({net_income:,.0f})",
            {"ocf": ocf, "net_income": net_income},
        )
    else:
        add("accrual", "Operating cash flow exceeds net income", None, "Need both OCF and net income")

    # 4. ROA improving
    if roa is not None and roa_prior is not None:
        add("roa_delta", "ROA improved year over year", roa > roa_prior, f"ROA {roa_prior:.2%} → {roa:.2%}", roa)
    else:
        add("roa_delta", "ROA improved year over year", None, "Prior ROA unavailable")

    # 5. Leverage decreasing (lower D/E is better)
    if debt is not None and debt_prior is not None:
        add(
            "leverage_delta",
            "Leverage decreased (D/E)",
            debt < debt_prior,
            f"D/E {debt_prior:.2f} → {debt:.2f}",
            debt,
        )
    elif debt is not None:
        # Soft pass when absolute leverage is conservative
        add("leverage_level", "Conservative leverage (D/E < 100)", debt < 100, f"D/E = {debt:.2f}", debt)
    else:
        add("leverage_delta", "Leverage decreased (D/E)", None, "Debt/equity unavailable")

    # 6. Current ratio improving / adequate
    if current is not None and current_prior is not None:
        add(
            "liquidity_delta",
            "Current ratio improved",
            current > current_prior,
            f"Current ratio {current_prior:.2f} → {current:.2f}",
            current,
        )
    elif current is not None:
        add("liquidity_level", "Adequate liquidity (current ratio ≥ 1.5)", current >= 1.5, f"Current ratio = {current:.2f}", current)
    else:
        add("liquidity_delta", "Current ratio improved", None, "Current ratio unavailable")

    # 7. No dilution
    if shares is not None and shares_prior is not None and shares_prior > 0:
        add(
            "no_dilution",
            "No share dilution",
            shares <= shares_prior * 1.01,
            f"Shares {shares_prior:,.0f} → {shares:,.0f}",
            shares,
        )
    else:
        add("no_dilution", "No share dilution", None, "Shares outstanding history unavailable")

    # 8. Gross margin improving
    if gross is not None and gross_prior is not None:
        add(
            "gross_margin_delta",
            "Gross margin improved",
            gross > gross_prior,
            f"Gross margin {gross_prior:.2%} → {gross:.2%}",
            gross,
        )
    elif _safe(metrics.get("margin_trend")) is not None:
        trend = _safe(metrics.get("margin_trend"))
        add(
            "margin_trend",
            "Profit margin improved",
            trend is not None and trend > 0,
            f"Margin trend = {trend:.2%}" if trend is not None else "n/a",
            trend,
        )
    else:
        add("gross_margin_delta", "Gross margin improved", None, "Gross margin history unavailable")

    # 9. Asset turnover improving
    if asset_turnover is not None and asset_turnover_prior is not None:
        add(
            "asset_turnover_delta",
            "Asset turnover improved",
            asset_turnover > asset_turnover_prior,
            f"Asset turnover {asset_turnover_prior:.3f} → {asset_turnover:.3f}",
            asset_turnover,
        )
    else:
        add("asset_turnover_delta", "Asset turnover improved", None, "Asset turnover history unavailable")

    available = [t for t in tests if t["available"]]
    score = sum(1 for t in available if t["passed"])
    max_score = len(available)

    return {
        "score": score,
        "max_score": max_score,
        "display": f"{score}/{max_score}" if max_score else "N/A",
        "tests": tests,
        "coverage": round(max_score / 9, 2) if max_score else 0.0,
    }


def compute_altman_z(metrics: dict[str, Any]) -> dict[str, Any]:
    """
    Altman Z″ = 6.56*X1 + 3.26*X2 + 6.72*X3 + 1.05*X4
    Skip for banks/financials.
    """
    sector = metrics.get("sector")
    industry = metrics.get("industry")
    if _is_financial(sector, industry):
        equity = _safe(metrics.get("book_value"))
        assets = _safe(metrics.get("total_assets"))
        debt = _safe(metrics.get("total_debt"))
        equity_to_assets = None
        if equity is not None and assets not in (None, 0):
            equity_to_assets = equity / assets
        return {
            "applicable": False,
            "skipped_reason": "Altman Z″ is not applied to banks/financials",
            "band": None,
            "z": None,
            "components": {
                "equity_to_assets": equity_to_assets,
                "total_debt": debt,
                "debt_to_equity": _safe(metrics.get("debt_to_equity")),
            },
            "formula": "Skipped for financial sector",
            "coverage": 0.5 if debt is not None or equity_to_assets is not None else 0.0,
        }

    total_assets = _safe(metrics.get("total_assets"))
    current_assets = _safe(metrics.get("current_assets"))
    current_liabilities = _safe(metrics.get("current_liabilities"))
    retained_earnings = _safe(metrics.get("retained_earnings"))
    ebit = _safe(metrics.get("ebit")) or _safe(metrics.get("operating_income"))
    book_equity = _safe(metrics.get("book_value"))
    total_liabilities = _safe(metrics.get("total_liabilities"))
    total_debt = _safe(metrics.get("total_debt"))

    # Approximations when full balance sheet is sparse
    if total_assets is None:
        # Rough TA ≈ cash + (market_cap / rough leverage) — too unreliable; leave missing
        total_assets = None

    if current_assets is None and current_liabilities is None:
        current_ratio = _safe(metrics.get("current_ratio"))
        total_cash = _safe(metrics.get("total_cash"))
        if current_ratio is not None and total_cash is not None and current_ratio > 0:
            # Approximate CL from cash as CA proxy / CR (weak)
            current_assets = total_cash
            current_liabilities = total_cash / current_ratio

    if book_equity is None:
        market_cap = _safe(metrics.get("market_cap"))
        price_to_book = _safe(metrics.get("price_to_book"))
        if market_cap is not None and price_to_book not in (None, 0):
            book_equity = market_cap / price_to_book

    if total_liabilities is None:
        total_liabilities = total_debt

    if ebit is None:
        roa = _safe(metrics.get("roa"))
        if roa is not None and total_assets not in (None, 0):
            # ROA ≈ NI/TA; use as weak EBIT/TA proxy with note
            ebit = roa * total_assets

    components: dict[str, Any] = {}
    x1 = x2 = x3 = x4 = None

    if total_assets not in (None, 0) and current_assets is not None and current_liabilities is not None:
        x1 = (current_assets - current_liabilities) / total_assets
        components["X1_wc_to_assets"] = round(x1, 4)

    if total_assets not in (None, 0) and retained_earnings is not None:
        x2 = retained_earnings / total_assets
        components["X2_re_to_assets"] = round(x2, 4)
    elif total_assets not in (None, 0) and book_equity is not None:
        # Fallback: use book equity / assets as retained-earnings proxy (documented)
        x2 = max(book_equity, 0) / total_assets * 0.5
        components["X2_re_to_assets_approx"] = round(x2, 4)

    if total_assets not in (None, 0) and ebit is not None:
        x3 = ebit / total_assets
        components["X3_ebit_to_assets"] = round(x3, 4)

    if total_liabilities not in (None, 0) and book_equity is not None:
        x4 = book_equity / total_liabilities
        components["X4_equity_to_liabilities"] = round(x4, 4)

    available_xs = [x for x in (x1, x2, x3, x4) if x is not None]
    if len(available_xs) < 3:
        return {
            "applicable": True,
            "skipped_reason": None,
            "band": "insufficient_data",
            "z": None,
            "components": components,
            "formula": "Z″ = 6.56*X1 + 3.26*X2 + 6.72*X3 + 1.05*X4",
            "coverage": round(len(available_xs) / 4, 2),
            "notes": ["Fewer than 3 Altman components available; Z″ withheld"],
        }

    # Fill missing with 0 but mark in notes
    notes = []
    if x1 is None:
        x1 = 0.0
        notes.append("X1 missing; treated as 0")
    if x2 is None:
        x2 = 0.0
        notes.append("X2 missing; treated as 0")
    if x3 is None:
        x3 = 0.0
        notes.append("X3 missing; treated as 0")
    if x4 is None:
        x4 = 0.0
        notes.append("X4 missing; treated as 0")

    z = 6.56 * x1 + 3.26 * x2 + 6.72 * x3 + 1.05 * x4
    if z > 2.6:
        band = "safe"
    elif z >= 1.1:
        band = "grey"
    else:
        band = "distress"

    return {
        "applicable": True,
        "skipped_reason": None,
        "band": band,
        "z": round(z, 3),
        "components": components,
        "formula": "Z″ = 6.56*X1 + 3.26*X2 + 6.72*X3 + 1.05*X4",
        "coverage": round(len([c for c in components.values() if c is not None]) / 4, 2),
        "notes": notes,
        "bands": {"safe": "> 2.6", "grey": "1.1 – 2.6", "distress": "< 1.1"},
    }


def fetch_fmp_ratio_history(ticker: str, limit: int = 6) -> list[dict[str, Any]]:
    if not FMP_API_KEY:
        return []
    try:
        url = f"https://financialmodelingprep.com/api/v3/ratios/{ticker}?limit={limit}&apikey={FMP_API_KEY}"
        res = requests.get(url, timeout=12)
        if res.status_code != 200:
            return []
        data = res.json()
        return data if isinstance(data, list) else []
    except Exception:
        return []


def compute_relative_valuation(
    metrics: dict[str, Any],
    peers: list[dict[str, Any]],
    history: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    forward_pe = _safe(metrics.get("forward_pe")) or _safe(metrics.get("pe_ratio"))
    price_to_sales = _safe(metrics.get("price_to_sales"))
    fcf = _safe(metrics.get("free_cashflow"))
    market_cap = _safe(metrics.get("market_cap"))
    fcf_yield = (fcf / market_cap) if fcf is not None and market_cap not in (None, 0) else None

    peer_forward_pes = [
        v
        for v in (_safe(p.get("forward_pe")) or _safe(p.get("pe_ratio")) for p in peers)
        if v is not None and v > 0
    ]
    peer_ps = [v for v in (_safe(p.get("price_to_sales")) for p in peers) if v is not None and v > 0]
    peer_fcf_yields = []
    for peer in peers:
        p_fcf = _safe(peer.get("free_cashflow"))
        p_cap = _safe(peer.get("market_cap"))
        if p_fcf is not None and p_cap not in (None, 0):
            peer_fcf_yields.append(p_fcf / p_cap)

    pe_peer_pct = _pct_rank(forward_pe if forward_pe and forward_pe > 0 else None, peer_forward_pes)
    ps_peer_pct = _pct_rank(price_to_sales if price_to_sales and price_to_sales > 0 else None, peer_ps)
    # For yield, higher is cheaper → invert percentile for "valuation richness"
    fcf_peer_pct_raw = _pct_rank(fcf_yield, peer_fcf_yields)
    fcf_peer_pct = round(100 - fcf_peer_pct_raw, 1) if fcf_peer_pct_raw is not None else None

    history = history or []
    hist_pe = [
        v
        for v in (_safe(row.get("priceEarningsRatio")) or _safe(row.get("peRatio")) for row in history)
        if v is not None and v > 0
    ]
    hist_fcf = []
    for row in history:
        # FMP freeCashFlowYield may be percent or decimal depending on endpoint
        raw = _safe(row.get("freeCashFlowYield"))
        if raw is None:
            continue
        hist_fcf.append(raw / 100 if abs(raw) > 1 else raw)

    pe_hist_pct = _pct_rank(forward_pe if forward_pe and forward_pe > 0 else None, hist_pe)
    fcf_hist_raw = _pct_rank(fcf_yield, hist_fcf)
    fcf_hist_pct = round(100 - fcf_hist_raw, 1) if fcf_hist_raw is not None else None

    # Composite valuation percentile: average of available "richness" percentiles (lower = cheaper)
    richness = [p for p in (pe_peer_pct, ps_peer_pct, fcf_peer_pct, pe_hist_pct, fcf_hist_pct) if p is not None]
    composite = round(sum(richness) / len(richness), 1) if richness else None

    if composite is None:
        label = "unknown"
    elif composite <= 40:
        label = "cheap"
    elif composite <= 60:
        label = "fair"
    else:
        label = "expensive"

    coverage_bits = [
        forward_pe is not None,
        price_to_sales is not None,
        fcf_yield is not None,
        bool(peer_forward_pes) or bool(peer_ps) or bool(peer_fcf_yields),
        bool(hist_pe) or bool(hist_fcf),
    ]

    return {
        "forward_pe": forward_pe,
        "price_to_sales": price_to_sales,
        "fcf_yield": round(fcf_yield, 4) if fcf_yield is not None else None,
        "peer_percentiles": {
            "forward_pe": pe_peer_pct,
            "price_to_sales": ps_peer_pct,
            "fcf_yield_richness": fcf_peer_pct,
            "peer_count": len(peers),
        },
        "history_percentiles": {
            "forward_pe": pe_hist_pct,
            "fcf_yield_richness": fcf_hist_pct,
            "years": len(history),
        },
        "composite_percentile": composite,
        "label": label,
        "coverage": round(sum(1 for b in coverage_bits if b) / len(coverage_bits), 2),
        "notes": [
            "Percentiles measure valuation richness (lower = cheaper).",
            "FCF yield richness inverts yield percentile so higher yield reads as cheaper.",
            "PEG is not used when forward earnings growth is non-positive or PE is missing.",
        ],
    }


def coverage_score(piotroski: dict[str, Any], altman: dict[str, Any], valuation: dict[str, Any]) -> float:
    parts = [
        float(piotroski.get("coverage") or 0),
        float(altman.get("coverage") or 0),
        float(valuation.get("coverage") or 0),
    ]
    return round(sum(parts) / len(parts), 2)


def derive_signal(
    piotroski: dict[str, Any],
    altman: dict[str, Any],
    valuation: dict[str, Any],
) -> dict[str, Any]:
    """
    Deterministic signal from pillars.
    Suppress when overall coverage < 0.5.
    """
    coverage = coverage_score(piotroski, altman, valuation)
    f_score = piotroski.get("score")
    f_max = piotroski.get("max_score") or 0
    # Normalize F to /9 scale when fewer tests available
    f_norm = (f_score / f_max * 9) if f_max else None

    z_band = altman.get("band")
    val_pct = valuation.get("composite_percentile")
    financial_skip = not altman.get("applicable", True)

    reasons: list[str] = []
    if coverage < COVERAGE_THRESHOLD:
        return {
            "overall_signal": "Neutral",
            "signal_label": "Insufficient Data",
            "confidence": "Low",
            "coverage": coverage,
            "suppressed": True,
            "reasons": [
                f"Coverage {coverage:.0%} is below the {COVERAGE_THRESHOLD:.0%} threshold; signal withheld.",
            ],
        }

    bullish = False
    bearish = False

    if f_norm is not None and f_norm >= 7 and val_pct is not None and val_pct <= 40:
        if financial_skip or z_band == "safe" or z_band == "grey":
            bullish = True
            reasons.append(
                f"Quality F≈{f_norm:.1f}/9 with valuation at {val_pct}th percentile"
                + (" (financials: Z skipped)" if financial_skip else f" and Z″ band {z_band}")
            )

    if f_norm is not None and f_norm <= 3:
        bearish = True
        reasons.append(f"Weak quality checklist (F≈{f_norm:.1f}/9)")
    if z_band == "distress":
        bearish = True
        reasons.append("Altman Z″ in distress band")
    if val_pct is not None and val_pct >= 75 and (f_norm is None or f_norm < 6):
        bearish = True
        reasons.append(f"Rich valuation ({val_pct}th pct) without strong quality offset")

    if bearish and not bullish:
        signal = "Bearish"
        label = "Risk-Off / Bearish Setup"
        confidence = "High" if coverage >= 0.7 else "Medium"
    elif bullish and not bearish:
        signal = "Bullish"
        label = "Bullish Setup"
        confidence = "High" if coverage >= 0.7 and (financial_skip or z_band == "safe") else "Medium"
    else:
        signal = "Neutral"
        label = "Watch / Hold Zone"
        confidence = "Medium" if coverage >= 0.65 else "Low"
        if not reasons:
            reasons.append("Pillars do not meet Bullish or Bearish thresholds")

    return {
        "overall_signal": signal,
        "signal_label": label,
        "confidence": confidence,
        "coverage": coverage,
        "suppressed": False,
        "reasons": reasons,
    }


def build_pillars(
    metrics: dict[str, Any],
    peers: list[dict[str, Any]],
    trends: dict[str, Any] | None = None,
) -> dict[str, Any]:
    history = fetch_fmp_ratio_history(metrics.get("ticker") or "", limit=6)
    piotroski = compute_piotroski(metrics, trends)
    altman = compute_altman_z(metrics)
    valuation = compute_relative_valuation(metrics, peers, history)
    signal = derive_signal(piotroski, altman, valuation)
    return {
        "schema": "market-signal-v5",
        "piotroski": piotroski,
        "altman": altman,
        "valuation": valuation,
        "signal": signal,
    }
