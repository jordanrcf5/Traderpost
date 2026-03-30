"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { SetupStat } from "@/lib/analytics/compute";

const GREEN = "#00C896";
const RED = "#f87171";
const GRID = "#0F1923";
const AXIS_TEXT = "#64748b";

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; payload: SetupStat }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const trades = payload[0].payload.trades;
  return (
    <div className="rounded border border-slate-700 bg-[#0F1923] px-3 py-2 text-sm">
      <p className="font-medium text-slate-300">{label}</p>
      <p style={{ color: val >= 0 ? GREEN : RED }} className="tabular-nums">
        {val >= 0 ? "+" : ""}${val.toFixed(2)}
      </p>
      <p className="text-slate-500">{trades} trade{trades !== 1 ? "s" : ""}</p>
    </div>
  );
}

export default function SetupBar({ data }: { data: SetupStat[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-lg border border-dashed border-slate-700 text-slate-500">
        No setup data
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-700 bg-[#1E2D3D] p-4">
      <p className="mb-4 text-sm font-medium uppercase tracking-wider text-slate-400">
        PnL by Setup Type
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 16, bottom: 4, left: 16 }}>
          <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="setup"
            tick={{ fill: AXIS_TEXT, fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: GRID }}
          />
          <YAxis
            tick={{ fill: AXIS_TEXT, fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: GRID }}
            tickFormatter={(v) => `$${v}`}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#ffffff08" }} />
          <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.pnl >= 0 ? GREEN : RED} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
