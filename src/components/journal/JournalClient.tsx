"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import TradeList from "@/components/journal/TradeList";
import TradeFilters, { type TradeFilterState } from "@/components/journal/TradeFilters";
import EditTradeModal from "@/components/journal/EditTradeModal";
import type { TradeListRow } from "@/lib/journal/trade-list";
import { MARKET_TYPE_MAP } from "@/lib/journal/trade-constants";

type Props = {
  trades: TradeListRow[];
  strategies: { id: string; name: string }[];
  userId: string;
};

const EMPTY_FILTERS: TradeFilterState = {
  instrument: "",
  session: "",
  direction: "",
  dateFrom: "",
  dateTo: "",
  marketType: "",
};

function getMarketType(instrument: string): string {
  return MARKET_TYPE_MAP[instrument.toLowerCase()] ?? "";
}

function applyFilters(trades: TradeListRow[], f: TradeFilterState): TradeListRow[] {
  return trades.filter((t) => {
    if (f.instrument) {
      const q = f.instrument.toLowerCase();
      if (!t.instrument.toLowerCase().includes(q)) return false;
    }
    if (f.session && t.session !== f.session) return false;
    if (f.direction && t.direction !== f.direction) return false;
    if (f.dateFrom) {
      const from = new Date(f.dateFrom);
      if (new Date(t.trade_date) < from) return false;
    }
    if (f.dateTo) {
      // include the full dateTo day
      const to = new Date(f.dateTo);
      to.setDate(to.getDate() + 1);
      if (new Date(t.trade_date) >= to) return false;
    }
    if (f.marketType) {
      const mt = getMarketType(t.instrument);
      if (mt !== f.marketType) return false;
    }
    return true;
  });
}

export default function JournalClient({ trades, strategies, userId }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [filters, setFilters] = useState<TradeFilterState>(EMPTY_FILTERS);
  const [editTrade, setEditTrade] = useState<TradeListRow | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const filtered = applyFilters(trades, filters);

  async function handleDelete(trade: TradeListRow) {
    setDeleteError(null);

    const { error } = await supabase.from("trades").delete().eq("id", trade.id);

    if (error) {
      setDeleteError(error.message);
      return;
    }

    // Best-effort: remove the screenshot from Storage if it exists
    if (trade.screenshot_url) {
      await supabase.storage.from("trade-screenshots").remove([trade.screenshot_url]);
    }

    router.refresh();
  }

  return (
    <>
      <TradeFilters filters={filters} onChange={setFilters} />

      {deleteError && (
        <p className="mt-3 text-sm text-red-400">Delete failed: {deleteError}</p>
      )}

      <TradeList
        trades={filtered}
        onEdit={(t) => setEditTrade(t)}
        onDelete={handleDelete}
      />

      {editTrade && (
        <EditTradeModal
          trade={editTrade}
          strategies={strategies}
          userId={userId}
          open={editTrade !== null}
          onOpenChange={(open) => { if (!open) setEditTrade(null); }}
        />
      )}
    </>
  );
}
