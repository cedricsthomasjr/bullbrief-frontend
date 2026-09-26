import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from utils.explore_sectors import build_sector_lists, normalize_company_name, select_sector_companies


UNIVERSE = {
    "GOOG",
    "GOOGL",
    "NVDA",
    "AAPL",
    "MSFT",
    "AVGO",
    "META",
    "ORCL",
    "SPY",
    "JPM",
    "BAC",
    "WFC",
    "GS",
    "MS",
    "C",
}


class ExploreSectorsTest(unittest.TestCase):
    def test_dual_class_and_filters(self):
        self.assertEqual(
            normalize_company_name("Alphabet Inc. Class A"),
            normalize_company_name("Alphabet Inc. Class C"),
        )
        rows = [
            {"symbol": "GOOG", "companyName": "Alphabet Inc. Class C", "marketCap": 2.1e12},
            {"symbol": "GOOGL", "companyName": "Alphabet Inc. Class A", "marketCap": 2.2e12},
            {"symbol": "NVDA", "companyName": "NVIDIA Corporation", "marketCap": 3e12},
            {"symbol": "AAPL", "companyName": "Apple Inc.", "marketCap": 2.9e12},
            {"symbol": "MSFT", "companyName": "Microsoft Corporation", "marketCap": 2.8e12},
            {"symbol": "AVGO", "companyName": "Broadcom Inc.", "marketCap": 1e12},
            {"symbol": "META", "companyName": "Meta Platforms, Inc.", "marketCap": 1.5e12},
            {"symbol": "ORCL", "companyName": "Oracle Corporation", "marketCap": 0.4e12},
            {"symbol": "SPY", "companyName": "SPDR S&P 500 ETF Trust", "marketCap": 5e12, "isEtf": True},
            {"symbol": "ZZZZ", "companyName": "Not Listed", "marketCap": 9e12},
            {"symbol": "AAPL", "companyName": "Apple Inc.", "marketCap": float("nan")},
        ]
        selected = select_sector_companies(rows, UNIVERSE)
        self.assertEqual(
            [row["symbol"] for row in selected],
            ["NVDA", "AAPL", "MSFT", "GOOGL", "META", "AVGO"],
        )

    def test_financials_uses_fmp_sector_name(self):
        asked = []

        def fetch(fmp_sector):
            asked.append(fmp_sector)
            if fmp_sector != "Financial Services":
                return []
            return [
                {"symbol": symbol, "companyName": f"{symbol} Inc.", "marketCap": (6 - index) * 1e11}
                for index, symbol in enumerate(["JPM", "BAC", "WFC", "GS", "MS", "C"])
            ]

        lists = build_sector_lists(fetch, UNIVERSE, {"JPM": "JPMorgan Chase & Co."})
        financials = next(item for item in lists if item["sector"] == "Financials")
        self.assertEqual(financials["source"], "fmp")
        self.assertEqual(financials["sectorEtf"], "XLF")
        self.assertEqual(len(financials["companies"]), 6)
        self.assertIn("Financial Services", asked)

    def test_missing_screener_fills_every_sector_from_the_basket(self):
        lists = build_sector_lists(lambda _sector: None, UNIVERSE, {"JPM": "JPMorgan Chase & Co."})
        self.assertEqual(len(lists), 11)
        for sector in lists:
            self.assertEqual(sector["source"], "static")
            self.assertGreaterEqual(len(sector["companies"]), 6)
            for company in sector["companies"]:
                self.assertIsNone(company["marketCap"])
        financials = next(item for item in lists if item["sector"] == "Financials")
        self.assertEqual(financials["companies"][0]["name"], "JPMorgan Chase & Co.")


if __name__ == "__main__":
    unittest.main()
