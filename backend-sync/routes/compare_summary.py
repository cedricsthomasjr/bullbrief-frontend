from flask import Blueprint, request, jsonify
import yfinance as yf
from openai import OpenAI
import json

compare_bp = Blueprint("compare", __name__)
client = OpenAI()


def safe(val):
    return round(val, 6) if isinstance(val, (int, float)) else None


def fmt_pe(value):
    return "N/A" if value is None else f"{value:.1f}x"


def fmt_pct(value):
    return "N/A" if value is None else f"{value * 100:.1f}%"


def fetch_ticker_data(ticker):
    try:
        stock = yf.Ticker(ticker)
        info = stock.info

        if not info or "shortName" not in info:
            print(f"[⚠️ Skipped] Incomplete info for {ticker}")
            return None

        return {
            "ticker": ticker,
            "company_name": info.get("shortName"),
            "market_cap": safe(info.get("marketCap")),
            "pe_ratio": safe(info.get("trailingPE")),
            "roe": safe(info.get("returnOnEquity")),
            "profit_margin": safe(info.get("profitMargins")),
            "sector": info.get("sector"),
            "industry": info.get("industry"),
        }

    except Exception as e:
        print(f"[❌ ERROR] Failed to fetch {ticker}: {str(e)}")
        return None


def template_insight(company, peers):
    peer_pes = [p["pe_ratio"] for p in peers if p.get("pe_ratio") is not None]
    peer_margins = [p["profit_margin"] for p in peers if p.get("profit_margin") is not None]
    peer_roes = [p["roe"] for p in peers if p.get("roe") is not None]

    pe = company.get("pe_ratio")
    margin = company.get("profit_margin")
    roe = company.get("roe")

    if pe is not None and peer_pes:
        avg_pe = sum(peer_pes) / len(peer_pes)
        valuation = (
            f"Trades at {fmt_pe(pe)} vs peer average {fmt_pe(avg_pe)} "
            f"({'premium' if pe > avg_pe else 'discount' if pe < avg_pe else 'in line'})."
        )
    else:
        valuation = f"P/E is {fmt_pe(pe)}; peer P/E context is limited."

    if margin is not None and peer_margins:
        avg_m = sum(peer_margins) / len(peer_margins)
        margins = (
            f"Profit margin {fmt_pct(margin)} vs peer average {fmt_pct(avg_m)}."
        )
    else:
        margins = f"Profit margin is {fmt_pct(margin)}."

    if roe is not None and peer_roes:
        avg_r = sum(peer_roes) / len(peer_roes)
        profitability = f"ROE {fmt_pct(roe)} vs peer average {fmt_pct(avg_r)}."
    else:
        profitability = f"ROE is {fmt_pct(roe)}."

    outlook = (
        "This comparison is descriptive only and based on currently available public multiples and margins."
    )

    return {
        "ticker": company["ticker"],
        "valuation": valuation,
        "profitability": profitability,
        "margins": margins,
        "outlook": outlook,
    }


@compare_bp.route("/compare-summary", methods=["POST"])
def compare_summary():
    try:
        payload = request.json or {}
        tickers = payload.get("tickers", [])
        tickers = [t.strip().upper() for t in tickers]
        use_llm = bool(payload.get("llm")) or request.args.get("llm") == "1"

        companies = [fetch_ticker_data(t) for t in tickers]
        companies = [c for c in companies if c]

        if len(companies) < 2:
            return jsonify(
                {
                    "tickers": [],
                    "insights": [],
                    "master_insight": "Not enough valid companies to compare.",
                }
            )

        if not use_llm:
            insights = []
            for company in companies:
                peers = [c for c in companies if c["ticker"] != company["ticker"]]
                insights.append(template_insight(company, peers))
            return jsonify(
                {
                    "tickers": companies,
                    "insights": insights,
                    "master_insight": "",
                    "mode": "deterministic",
                }
            )

        company_metrics = "\n".join(
            [
                f"{c['company_name']} ({c['ticker']}): "
                f"PE={c['pe_ratio'] or 'N/A'}, "
                f"ROE={c['roe'] or 'N/A'}, "
                f"Margin={c['profit_margin'] or 'N/A'}"
                for c in companies
            ]
        )

        formatted_prompt = f"""
You're an equity research assistant. For each company below, return a JSON array where each element is an object in the following structure:

{{
  "ticker": "AAPL",
  "valuation": "...",
  "profitability": "...",
  "margins": "...",
  "outlook": "..."
}}

Each field should be a short paragraph. No buy/sell advice. Respond with valid JSON only.

Company data:
{company_metrics}
"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": formatted_prompt}],
            temperature=0.3,
            max_tokens=900,
        )

        raw_content = response.choices[0].message.content

        try:
            parsed_insights = json.loads(raw_content)
        except json.JSONDecodeError:
            print(f"[❌ JSON ERROR] Raw GPT output:\n{raw_content}")
            return jsonify({"error": "Failed to parse AI response"}), 500

        return jsonify(
            {
                "tickers": companies,
                "insights": parsed_insights,
                "master_insight": "",
                "mode": "llm",
            }
        )

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500
