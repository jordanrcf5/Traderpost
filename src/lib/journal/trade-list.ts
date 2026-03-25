import type { SupabaseClient } from "@supabase/supabase-js";

/** Public.trades row fields used on the journal list (from PostgREST). */
export type TradeRowFromDb = {
  id: string;
  instrument: string;
  direction: string;
  entry_price: string | number;
  exit_price: string | number;
  position_size: string | number;
  pnl: string | number | null;
  risk_reward_ratio: string | number | null;
  trade_date: string;
  session: string | null;
  setup_type: string | null;
  emotion_tags: string[] | null;
  rating: number | null;
  notes: string | null;
  screenshot_url: string | null;
};

export type TradeListRow = TradeRowFromDb & {
  screenshotSignedUrl: string | null;
};

const BUCKET = "trade-screenshots";
const SIGNED_URL_SECONDS = 60 * 60 * 24;

export async function attachSignedScreenshotUrls(
  supabase: SupabaseClient,
  trades: TradeRowFromDb[],
): Promise<TradeListRow[]> {
  return Promise.all(
    trades.map(async (row) => {
      if (!row.screenshot_url) {
        return { ...row, screenshotSignedUrl: null };
      }
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(row.screenshot_url, SIGNED_URL_SECONDS);
      if (error || !data?.signedUrl) {
        return { ...row, screenshotSignedUrl: null };
      }
      return { ...row, screenshotSignedUrl: data.signedUrl };
    }),
  );
}

export function formatNum(value: string | number | null | undefined, decimals = 2): string {
  if (value === null || value === undefined) {
    return "—";
  }
  const n = typeof value === "string" ? Number.parseFloat(value) : value;
  if (!Number.isFinite(n)) {
    return "—";
  }
  return n.toFixed(decimals);
}
