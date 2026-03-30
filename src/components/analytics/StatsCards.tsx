"use client";

import type { AnalyticsStats } from "@/lib/analytics/compute";

type CardProps = { label: string; value: string; positive?: boolean | null };

function Card({ label, value, positive }: CardProps) {
  const valueColor =
    positive === true
      ? "text-[#00C896]"
      : positive === false
        ? "text-red-400"
        : "text-white";

  return (
    <div className="rounded-lg border border-slate-700 bg-[#1E2D3D] p-4">
      <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tabular-nums ${valueColor}`}>{value}</p>
    </div>
  );
}

function fmt(n: number, prefix = "$"): string {
  return `${n >= 0 ? "+" : ""}${prefix}${Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function StatsCards({ stats }: { stats: AnalyticsStats }) {
  const pnlPos = stats.totalPnl > 0 ? true : stats.totalPnl < 0 ? false : null;
  const ddPos = stats.maxDrawdown < 0 ? false : null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
      <Card
        label="Total PnL"
        value={fmt(stats.totalPnl)}
        positive={pnlPos}
      />
      <Card
        label="Win Rate"
        value={`${stats.winRate.toFixed(1)}%`}
        positive={stats.winRate >= 50 ? true : false}
      />
      <Card
        label="Profit Factor"
        value={stats.profitFactor != null ? stats.profitFactor.toFixed(2) : "—"}
        positive={
          stats.profitFactor != null
            ? stats.profitFactor >= 1
              ? true
              : false
            : null
        }
      />
      <Card
        label="Max Drawdown"
        value={stats.maxDrawdown !== 0 ? fmt(stats.maxDrawdown) : "$0.00"}
        positive={ddPos}
      />
      <Card
        label="Total Trades"
        value={String(stats.totalTrades)}
      />
      <Card
        label="Avg R:R"
        value={stats.avgRR != null ? stats.avgRR.toFixed(2) : "—"}
        positive={stats.avgRR != null ? stats.avgRR >= 1 : null}
      />
    </div>
  );
}
