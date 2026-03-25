export type TradeDirection = "long" | "short";

export type TradingSession = "london" | "ny" | "asian" | "overnight";

/** Row shape for inserting into `public.trades` from the client (user_id set explicitly). */
export type TradeInsert = {
  user_id: string;
  strategy_id: string | null;
  instrument: string;
  direction: TradeDirection;
  entry_price: number;
  exit_price: number;
  position_size: number;
  pnl: number;
  risk_reward_ratio: number | null;
  trade_date: string;
  session: TradingSession | null;
  setup_type: string | null;
  emotion_tags: string[] | null;
  rating: number | null;
  notes: string | null;
  screenshot_url: string | null;
};
