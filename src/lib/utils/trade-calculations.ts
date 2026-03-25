import type { TradeDirection } from "@/lib/types/trade";

/**
 * Dollar PnL from entry/exit and direction.
 * Long: profit when exit > entry (for positive size).
 * Short: profit when entry > exit.
 */
export function calculatePnl(
  direction: TradeDirection,
  entryPrice: number,
  exitPrice: number,
  positionSize: number,
): number {
  if (direction === "long") {
    return (exitPrice - entryPrice) * positionSize;
  }
  return (entryPrice - exitPrice) * positionSize;
}

/**
 * Risk:reward when the user supplies risk in dollars (e.g. planned max loss).
 * Returns null if risk is missing or not positive.
 */
export function calculateRiskRewardRatio(
  pnl: number,
  riskDollars: number | null | undefined,
): number | null {
  if (riskDollars == null || riskDollars <= 0) {
    return null;
  }
  return pnl / riskDollars;
}
