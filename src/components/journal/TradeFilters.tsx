"use client";

import { SESSIONS, INSTRUMENT_GROUPS } from "@/lib/journal/trade-constants";

export type TradeFilterState = {
  instrument: string;
  session: string;
  direction: string;
  dateFrom: string;
  dateTo: string;
  marketType: string;
};

const MARKET_TYPES = INSTRUMENT_GROUPS.filter((g) => g.marketType !== "other").map((g) => ({
  value: g.marketType,
  label: g.label,
}));

type Props = {
  filters: TradeFilterState;
  onChange: (filters: TradeFilterState) => void;
};

const inputClass =
  "w-full rounded-md border border-slate-600 bg-[#1E2D3D] px-3 py-2 text-slate-100 text-sm outline-none focus:border-[#00C896]";

export default function TradeFilters({ filters, onChange }: Props) {
  function set(key: keyof TradeFilterState, value: string) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="mt-6 rounded-lg border border-slate-700 bg-[#1E2D3D] p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Instrument</label>
          <input
            type="text"
            className={inputClass}
            placeholder="e.g. NQ, BTC"
            value={filters.instrument}
            onChange={(e) => set("instrument", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Session</label>
          <select
            className={inputClass}
            value={filters.session}
            onChange={(e) => set("session", e.target.value)}
          >
            <option value="">All sessions</option>
            {SESSIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Direction</label>
          <select
            className={inputClass}
            value={filters.direction}
            onChange={(e) => set("direction", e.target.value)}
          >
            <option value="">All directions</option>
            <option value="long">Long</option>
            <option value="short">Short</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Date from</label>
          <input
            type="date"
            className={inputClass}
            value={filters.dateFrom}
            onChange={(e) => set("dateFrom", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Date to</label>
          <input
            type="date"
            className={inputClass}
            value={filters.dateTo}
            onChange={(e) => set("dateTo", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Market type</label>
          <select
            className={inputClass}
            value={filters.marketType}
            onChange={(e) => set("marketType", e.target.value)}
          >
            <option value="">All markets</option>
            {MARKET_TYPES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {(filters.instrument || filters.session || filters.direction || filters.dateFrom || filters.dateTo || filters.marketType) && (
        <button
          type="button"
          className="mt-3 text-xs text-slate-400 hover:text-[#00C896] underline"
          onClick={() =>
            onChange({ instrument: "", session: "", direction: "", dateFrom: "", dateTo: "", marketType: "" })
          }
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
