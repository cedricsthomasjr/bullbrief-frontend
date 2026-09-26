/** The 11 Movers sectors, in fixed list order. Not a performance ranking. */

export type SectorDef = {
  sector: string;
  sectorEtf: string;
  /** FMP company-screener `sector` value. */
  fmpSector: string;
};

export const SECTORS: readonly SectorDef[] = [
  { sector: "Technology", sectorEtf: "XLK", fmpSector: "Technology" },
  { sector: "Healthcare", sectorEtf: "XLV", fmpSector: "Healthcare" },
  { sector: "Financials", sectorEtf: "XLF", fmpSector: "Financial Services" },
  { sector: "Consumer Discretionary", sectorEtf: "XLY", fmpSector: "Consumer Cyclical" },
  { sector: "Consumer Staples", sectorEtf: "XLP", fmpSector: "Consumer Defensive" },
  { sector: "Industrials", sectorEtf: "XLI", fmpSector: "Industrials" },
  { sector: "Energy", sectorEtf: "XLE", fmpSector: "Energy" },
  { sector: "Utilities", sectorEtf: "XLU", fmpSector: "Utilities" },
  { sector: "Real Estate", sectorEtf: "XLRE", fmpSector: "Real Estate" },
  { sector: "Materials", sectorEtf: "XLB", fmpSector: "Basic Materials" },
  { sector: "Communication Services", sectorEtf: "XLC", fmpSector: "Communication Services" },
];

/** Hand baskets, keyed by the FMP sector name. Used only when the screener is thin or down. */
export const SECTOR_PEERS: Record<string, readonly string[]> = {
  Technology: ["MSFT", "AAPL", "NVDA", "GOOGL", "META", "AVGO", "ORCL"],
  "Communication Services": ["GOOGL", "META", "NFLX", "DIS", "TMUS", "VZ"],
  "Consumer Cyclical": ["AMZN", "TSLA", "HD", "MCD", "NKE", "SBUX"],
  "Consumer Defensive": ["WMT", "COST", "PG", "KO", "PEP", "MDLZ"],
  "Financial Services": ["JPM", "BAC", "WFC", "GS", "MS", "C"],
  Healthcare: ["LLY", "UNH", "JNJ", "MRK", "ABBV", "TMO"],
  Industrials: ["GE", "CAT", "HON", "UPS", "RTX", "DE"],
  Energy: ["XOM", "CVX", "COP", "SLB", "EOG", "MPC"],
  "Basic Materials": ["LIN", "SHW", "FCX", "NEM", "APD", "ECL"],
  "Real Estate": ["PLD", "AMT", "EQIX", "WELL", "SPG", "O"],
  Utilities: ["NEE", "SO", "DUK", "AEP", "SRE", "D"],
};

export const LANDING_TICKERS = ["NVDA", "AAPL", "GOOGL", "META", "TSLA", "JPM"] as const;

export type ComparePreset = {
  id: string;
  label: string;
  tickers: string[];
  description: string;
};

export const COMPARE_PRESETS: ComparePreset[] = [
  {
    id: "megacap-cloud-ai",
    label: "Mega-cap Cloud & AI Infrastructure",
    tickers: ["MSFT", "GOOGL", "AMZN"],
    description:
      "Three mega-cap parents whose largest growth engine is cloud and AI infrastructure.",
  },
  {
    id: "money-center-banks",
    label: "Money-Center Banks",
    tickers: ["JPM", "BAC", "WFC"],
    description: "Three of the largest U.S. money-center banks by balance sheet size.",
  },
  {
    id: "crypto-exchange-treasury-etf",
    label: "Exchange vs. Treasury vs. ETF",
    tickers: ["COIN", "MSTR", "IBIT"],
    description:
      "Three different structures: an exchange, a company with bitcoin on the balance sheet, and a spot bitcoin ETF.",
  },
];
