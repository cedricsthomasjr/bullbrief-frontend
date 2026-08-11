def generate_prompt(
    company_name,
    ticker,
    sector,
    market_cap,
    pe_ratio,
    range_52w,
    profit_margin=None,
    free_cashflow=None,
    revenue_growth=None,
):
    extras = []
    if profit_margin is not None and profit_margin != "":
        extras.append(f"Profit Margin: {profit_margin}")
    if free_cashflow is not None and free_cashflow != "":
        extras.append(f"Free Cash Flow: {free_cashflow}")
    if revenue_growth is not None and revenue_growth != "":
        extras.append(f"Revenue Growth: {revenue_growth}")
    extras_block = "\n".join(extras)

    return f"""
You are a financial analyst assistant. Write a concise plain-English business summary for investors.
Do NOT include SWOT analysis. Do NOT include an Outlook section. Do NOT give buy/sell advice.

Company: {company_name}
Stock Ticker: {ticker}
Sector: {sector}
Market Cap: {market_cap}
P/E Ratio: {pe_ratio}
52-Week Range: {range_52w}
{extras_block}

Format your response using the **exact header below** (do not rename or reword).

Business Summary
----------------
Write 3-5 short sentences covering: what the company does, how it makes money, recent performance context from the metrics above, and competitive position. Be specific. If a metric is missing, do not invent it.
"""
