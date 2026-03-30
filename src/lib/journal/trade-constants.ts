import type { TradingSession } from "@/lib/types/trade";

export type InstrumentMarketType =
  | "futures"
  | "crypto"
  | "forex"
  | "commodities"
  | "stocks"
  | "other";

export type InstrumentGroup = {
  label: string;
  marketType: InstrumentMarketType;
  instruments: string[];
};

export const INSTRUMENT_GROUPS: InstrumentGroup[] = [
  {
    label: "Futures",
    marketType: "futures",
    instruments: ["NQ", "ES", "YM", "RTY", "CL", "GC", "SI"],
  },
  {
    label: "Crypto",
    marketType: "crypto",
    instruments: ["BTC", "ETH", "SOL", "XRP", "DOGE"],
  },
  {
    label: "Forex",
    marketType: "forex",
    instruments: ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "NZD/USD"],
  },
  {
    label: "Commodities",
    marketType: "commodities",
    instruments: ["Gold", "Silver", "Oil", "Natural Gas"],
  },
  {
    label: "Stocks",
    marketType: "stocks",
    instruments: ["SPY", "QQQ", "AAPL", "TSLA", "NVDA"],
  },
  {
    label: "Other",
    marketType: "other",
    instruments: ["Other"],
  },
];

/** Maps instrument name (lowercase) → market type. Derived from INSTRUMENT_GROUPS. */
export const MARKET_TYPE_MAP: Record<string, InstrumentMarketType> = Object.fromEntries(
  INSTRUMENT_GROUPS.flatMap((g) =>
    g.instruments
      .filter((i) => i !== "Other")
      .map((i) => [i.toLowerCase(), g.marketType]),
  ),
);

/** Flat list of all preset instrument values (including "Other"). */
export const ALL_PRESET_INSTRUMENTS: string[] = INSTRUMENT_GROUPS.flatMap(
  (g) => g.instruments,
);

export const SESSIONS: { value: TradingSession; label: string }[] = [
  { value: "london", label: "London" },
  { value: "ny", label: "New York" },
  { value: "asian", label: "Asian" },
  { value: "overnight", label: "Overnight" },
];

export const EMOTION_OPTIONS = [
  "focused",
  "patient",
  "fomo",
  "revenge",
  "overconfident",
  "anxious",
] as const;

export const SETUP_SUGGESTIONS = ["FVG", "OB", "BOS", "CHoCH", "Liquidity Sweep"];
