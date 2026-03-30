import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { computeAnalytics } from "@/lib/analytics/compute";
import type { TradeRowFromDb } from "@/lib/journal/trade-list";
import StatsCards from "@/components/analytics/StatsCards";
import EquityCurve from "@/components/analytics/EquityCurve";
import WinRateDonut from "@/components/analytics/WinRateDonut";
import SessionBar from "@/components/analytics/SessionBar";
import SetupBar from "@/components/analytics/SetupBar";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: tradesRaw } = await supabase
    .from("trades")
    .select(
      "id, instrument, direction, entry_price, exit_price, position_size, pnl, risk_reward_ratio, trade_date, session, setup_type, emotion_tags, rating, notes, screenshot_url",
    )
    .eq("user_id", user.id)
    .order("trade_date", { ascending: true });

  const trades = (tradesRaw ?? []) as TradeRowFromDb[];
  const stats = computeAnalytics(trades);

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Analytics</h1>
        <p className="mt-1 text-sm text-slate-400">
          Performance breakdown across {stats.totalTrades} logged trade{stats.totalTrades !== 1 ? "s" : ""}.
        </p>
      </div>

      <StatsCards stats={stats} />

      <EquityCurve data={stats.equityCurve} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <WinRateDonut wins={stats.wins} losses={stats.losses} winRate={stats.winRate} />
        <SessionBar data={stats.bySesssion} />
      </div>

      <SetupBar data={stats.bySetup} />
    </main>
  );
}
