"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const GREEN = "#00C896";
const RED = "#f87171";
const EMPTY = "#1E2D3D";

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number }[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded border border-slate-700 bg-[#0F1923] px-3 py-2 text-sm">
      <p className="text-slate-300">
        {payload[0].name}: <span className="font-semibold">{payload[0].value}</span>
      </p>
    </div>
  );
}

export default function WinRateDonut({
  wins,
  losses,
  winRate,
}: {
  wins: number;
  losses: number;
  winRate: number;
}) {
  const total = wins + losses;
  const data =
    total === 0
      ? [{ name: "No trades", value: 1 }]
      : [
          { name: "Wins", value: wins },
          { name: "Losses", value: losses },
        ];

  const colors = total === 0 ? [EMPTY] : [GREEN, RED];

  return (
    <div className="rounded-lg border border-slate-700 bg-[#1E2D3D] p-4">
      <p className="mb-2 text-sm font-medium uppercase tracking-wider text-slate-400">
        Win Rate
      </p>
      <div className="relative">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={88}
              paddingAngle={total > 0 ? 3 : 0}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i]} />
              ))}
            </Pie>
            {total > 0 && <Tooltip content={<CustomTooltip />} />}
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-xs text-slate-400">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-6">
          <span
            className="text-2xl font-bold"
            style={{ color: winRate >= 50 ? GREEN : RED }}
          >
            {total > 0 ? `${winRate.toFixed(1)}%` : "—"}
          </span>
          <span className="text-xs text-slate-500">win rate</span>
        </div>
      </div>
    </div>
  );
}
