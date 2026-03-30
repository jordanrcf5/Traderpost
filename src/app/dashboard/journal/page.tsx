import { redirect } from "next/navigation";
import TradeForm from "@/components/journal/TradeForm";
import JournalClient from "@/components/journal/JournalClient";
import { attachSignedScreenshotUrls, type TradeRowFromDb } from "@/lib/journal/trade-list";
import { createClient } from "@/lib/supabase/server";

export default async function JournalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: strategies } = await supabase
    .from("strategies")
    .select("id, name")
    .eq("user_id", user.id)
    .order("name");

  const { data: tradesRaw } = await supabase
    .from("trades")
    .select(
      "id, instrument, direction, entry_price, exit_price, position_size, pnl, risk_reward_ratio, trade_date, session, setup_type, emotion_tags, rating, notes, screenshot_url",
    )
    .eq("user_id", user.id)
    .order("trade_date", { ascending: false });

  const trades = await attachSignedScreenshotUrls(
    supabase,
    (tradesRaw ?? []) as TradeRowFromDb[],
  );

  return (
    <main>
      <h1 className="text-2xl font-semibold">Trade Journal</h1>
      <p className="mt-2 max-w-2xl text-slate-300">
        Log a trade with full context. PnL and R-multiple update as you type. Attach an optional
        chart screenshot — stored privately in Supabase Storage.
      </p>
      <TradeForm userId={user.id} strategies={strategies ?? []} />
      <JournalClient trades={trades} strategies={strategies ?? []} />
    </main>
  );
}
