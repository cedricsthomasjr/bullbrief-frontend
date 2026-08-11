from flask import Blueprint, request, jsonify
from openai import OpenAI
from utils.scraper import scrape_macrotrends
from utils.helpers import resolve_slug
from utils.eps import get_eps_data
from utils.income_statement import get_metric_from_income_statement
import os

router = Blueprint("interpret", __name__)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def _to_float(value):
    try:
        if value is None:
            return None
        if isinstance(value, str):
            cleaned = value.replace(",", "").replace("$", "").replace("%", "").strip()
            if cleaned in ("", "-", "N/A", "n/a"):
                return None
            return float(cleaned)
        return float(value)
    except (TypeError, ValueError):
        return None


def deterministic_trend_bullets(metric: str, metric_data: list) -> str:
    rows = []
    for row in metric_data[:10]:
        year = row.get("year")
        value = _to_float(row.get("value"))
        if year is None or value is None:
            continue
        rows.append({"year": year, "value": value})

    if len(rows) < 2:
        return "- Insufficient historical points to describe the trend."

    latest = rows[0]
    prior = rows[1]
    oldest = rows[-1]
    delta = latest["value"] - prior["value"]
    pct = (delta / abs(prior["value"]) * 100) if prior["value"] != 0 else None

    if len(rows) >= 3 and oldest["value"] != 0:
        years = max(len(rows) - 1, 1)
        cagr = ((latest["value"] / abs(oldest["value"])) ** (1 / years) - 1) * 100
        if latest["value"] < 0 and oldest["value"] > 0:
            cagr = None
    else:
        cagr = None

    direction = "rose" if delta > 0 else "fell" if delta < 0 else "was unchanged"
    bullets = [
        f"- Latest ({latest['year']}): {latest['value']:,.4g}.",
        f"- Versus prior year ({prior['year']}): {direction}"
        + (f" {abs(pct):.1f}%." if pct is not None else "."),
    ]
    if cagr is not None:
        bullets.append(f"- Multi-year path: approx CAGR {cagr:.1f}% across available history.")
    else:
        span_dir = "higher" if latest["value"] > oldest["value"] else "lower" if latest["value"] < oldest["value"] else "flat"
        bullets.append(f"- Versus earliest point ({oldest['year']}): {span_dir} at {oldest['value']:,.4g}.")
    bullets.append(f"- Investor takeaway: watch whether {metric} keeps this trajectory in the next report.")
    return "\n".join(bullets[:4])


@router.route("/interpret/<ticker>", methods=["GET"])
def interpret_metric(ticker):
    metric = request.args.get("metric")
    if not metric:
        return jsonify({"error": "Metric parameter is required"}), 400

    ticker = ticker.upper()
    slug = resolve_slug(ticker)
    metric_lower = metric.lower()
    explain = request.args.get("explain") == "1"

    try:
        if metric_lower == "eps":
            metric_data = get_eps_data(ticker)
            if isinstance(metric_data, str):
                return jsonify({"error": metric_data}), 500

        elif metric_lower == "revenue":
            metric_data = get_metric_from_income_statement(ticker, "revenue")
            if isinstance(metric_data, str):
                return jsonify({"error": metric_data}), 500

        else:
            data = scrape_macrotrends(ticker, slug)
            matched_key = next((k for k in data.keys() if k.lower() == metric_lower), None)
            if not matched_key or not isinstance(data[matched_key], list):
                return jsonify({"error": f"No valid data found for metric '{metric}'"}), 404
            metric_data = data[matched_key]

        analysis = deterministic_trend_bullets(metric, metric_data)

        if explain:
            trend_string = ", ".join(f"{row['year']}: {row['value']}" for row in metric_data[:10])
            prompt = f"""
You are a financial analyst. Briefly summarize the {metric} trend for {ticker} from the following data:

{trend_string}

Use clear, simple language. Focus on direction, key jumps, and investor relevance. Limit to 4 bullet points max.
"""
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                max_tokens=300,
            )
            analysis = response.choices[0].message.content.strip()

        return jsonify({"analysis": analysis, "mode": "llm" if explain else "deterministic"})

    except Exception as e:
        return jsonify({"error": f"AI generation failed: {str(e)}"}), 500
