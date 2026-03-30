import type { TradeRowFromDb } from "@/lib/journal/trade-list";

export type EquityPoint = { date: string; cumPnl: number };
export type SessionStat = { session: string; pnl: number; trades: number };
export type SetupStat = { setup: string; pnl: number; trades: number };

export type AnalyticsStats = {
  totalPnl: number;
  winRate: number; // 0–100
  profitFactor: number | null;
  maxDrawdown: number; // negative number, e.g. -320
  totalTrades: number;
  avgRR: number | null;
  wins: number;
  losses: number;
  equityCurve: EquityPoint[];
  bySesssion: SessionStat[];
  bySetup: SetupStat[];
};

export function computeAnalytics(trades: TradeRowFromDb[]): AnalyticsStats {
  // Sort oldest first for equity curve
  const sorted = [...trades].sort(
    (a, b) => new Date(a.trade_date).getTime() - new Date(b.trade_date).getTime(),
  );

  let totalPnl = 0;
  let wins = 0;
  let losses = 0;
  let grossProfit = 0;
  let grossLoss = 0;
  let rrSum = 0;
  let rrCount = 0;
  const equityCurve: EquityPoint[] = [];
  const sessionMap = new Map<string, { pnl: number; trades: number }>();
  const setupMap = new Map<string, { pnl: number; trades: number }>();

  // Track peak for drawdown
  let peak = 0;
  let maxDrawdown = 0;

  for (const t of sorted) {
    const pnl = t.pnl != null ? Number(t.pnl) : 0;
    totalPnl += pnl;
    if (pnl > 0) {
      wins++;
      grossProfit += pnl;
    } else if (pnl < 0) {
      losses++;
      grossLoss += Math.abs(pnl);
    }

    if (totalPnl > peak) peak = totalPnl;
    const dd = totalPnl - peak;
    if (dd < maxDrawdown) maxDrawdown = dd;

    if (t.risk_reward_ratio != null) {
      const rr = Number(t.risk_reward_ratio);
      if (Number.isFinite(rr)) {
        rrSum += rr;
        rrCount++;
      }
    }

    const dateLabel = t.trade_date.slice(0, 10);
    equityCurve.push({ date: dateLabel, cumPnl: Math.round(totalPnl * 100) / 100 });

    const session = t.session ?? "Unknown";
    const sess = sessionMap.get(session) ?? { pnl: 0, trades: 0 };
    sess.pnl += pnl;
    sess.trades++;
    sessionMap.set(session, sess);

    const setup = t.setup_type ?? "Unknown";
    const su = setupMap.get(setup) ?? { pnl: 0, trades: 0 };
    su.pnl += pnl;
    su.trades++;
    setupMap.set(setup, su);
  }

  const totalTrades = trades.length;
  const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? null : null;
  const avgRR = rrCount > 0 ? rrSum / rrCount : null;

  const bySesssion: SessionStat[] = Array.from(sessionMap.entries()).map(([session, v]) => ({
    session,
    pnl: Math.round(v.pnl * 100) / 100,
    trades: v.trades,
  }));

  const bySetup: SetupStat[] = Array.from(setupMap.entries()).map(([setup, v]) => ({
    setup,
    pnl: Math.round(v.pnl * 100) / 100,
    trades: v.trades,
  }));

  return {
    totalPnl: Math.round(totalPnl * 100) / 100,
    winRate: Math.round(winRate * 10) / 10,
    profitFactor: profitFactor != null ? Math.round(profitFactor * 100) / 100 : null,
    maxDrawdown: Math.round(maxDrawdown * 100) / 100,
    totalTrades,
    avgRR: avgRR != null ? Math.round(avgRR * 100) / 100 : null,
    wins,
    losses,
    equityCurve,
    bySesssion,
    bySetup,
  };
}
