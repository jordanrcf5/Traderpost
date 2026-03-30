"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { EquityPoint } from "@/lib/analytics/compute";

const GRID = "#1E2D3D";
const AXIS_TEXT = "#64748b";
const GREEN = "#00C896";
const RED = "#f87171";

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const color = val >= 0 ? GREEN : RED;
  return (
    <div className="rounded border border-slate-700 bg-[#0F1923] px-3 py-2 text-sm">
      <p className="text-slate-400">{label}</p>
      <p style={{ color }} className="font-semibold tabular-nums">
        {val >= 0 ? "+" : ""}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </div>
  );
}

export default function EquityCurve({ data }: { data: EquityPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-lg border border-dashed border-slate-700 text-slate-500">
        No trade data yet
      </div>
    );
  }

  const lastVal = data[data.length - 1].cumPnl;
  const lineColor = lastVal >= 0 ? GREEN : RED;

  return (
    <div className="rounded-lg border border-slate-700 bg-[#1E2D3D] p-4">
      <p className="mb-4 text-sm font-medium uppercase tracking-wider text-slate-400">
        PnL Equity Curve
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 4, right: 16, bottom: 4, left: 16 }}>
          <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fill: AXIS_TEXT, fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: GRID }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: AXIS_TEXT, fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: GRID }}
            tickFormatter={(v) => `$${v}`}
            width={64}
          />
          <ReferenceLine y={0} stroke="#374151" strokeDasharray="4 2" />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="cumPnl"
            stroke={lineColor}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: lineColor }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
