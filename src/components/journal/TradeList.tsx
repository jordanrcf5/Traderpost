import { formatNum, type TradeListRow } from "@/lib/journal/trade-list";

type TradeListProps = {
  trades: TradeListRow[];
};

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function TradeList({ trades }: TradeListProps) {
  if (trades.length === 0) {
    return (
      <p className="mt-8 rounded-lg border border-dashed border-slate-600 bg-slate-900/40 px-4 py-6 text-center text-slate-400">
        No trades yet. Log your first trade above.
      </p>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold text-white">Logged trades</h2>
      <p className="mt-1 text-sm text-slate-400">
        Newest first. Chart images use a private signed link (refreshes when you reload the page).
      </p>
      <ul className="mt-4 space-y-4">
        {trades.map((t) => (
          <li
            key={t.id}
            className="overflow-hidden rounded-lg border border-slate-700 bg-[#1E2D3D]"
          >
            <div className="flex flex-col gap-4 p-4 md:flex-row md:items-start">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-lg font-semibold text-white">{t.instrument}</span>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-xs capitalize text-slate-300">
                    {t.direction}
                  </span>
                  <span className="text-sm text-slate-400">{formatDate(t.trade_date)}</span>
                </div>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-slate-500">Entry</dt>
                    <dd className="font-mono text-slate-200">{formatNum(t.entry_price)}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Exit</dt>
                    <dd className="font-mono text-slate-200">{formatNum(t.exit_price)}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Size</dt>
                    <dd className="font-mono text-slate-200">{formatNum(t.position_size)}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">PnL</dt>
                    <dd
                      className={
                        t.pnl != null && Number(t.pnl) >= 0 ? "text-[#00C896]" : "text-red-400"
                      }
                    >
                      {formatNum(t.pnl)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">R-multiple</dt>
                    <dd className="text-slate-200">{formatNum(t.risk_reward_ratio)}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Session</dt>
                    <dd className="capitalize text-slate-200">{t.session ?? "—"}</dd>
                  </div>
                </dl>
                {t.setup_type ? (
                  <p className="text-sm text-slate-400">
                    <span className="text-slate-500">Setup:</span> {t.setup_type}
                  </p>
                ) : null}
                {t.emotion_tags && t.emotion_tags.length > 0 ? (
                  <p className="text-sm text-slate-400">
                    <span className="text-slate-500">Emotions:</span>{" "}
                    {t.emotion_tags.join(", ")}
                  </p>
                ) : null}
                {t.rating != null ? (
                  <p className="text-sm text-slate-400">
                    <span className="text-slate-500">Plan rating:</span> {t.rating}/5
                  </p>
                ) : null}
                {t.notes ? (
                  <p className="whitespace-pre-wrap text-sm text-slate-300">{t.notes}</p>
                ) : null}
              </div>
              {t.screenshotSignedUrl ? (
                <div className="shrink-0 md:w-56">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.screenshotSignedUrl}
                    alt={`${t.instrument} chart`}
                    className="max-h-40 w-full rounded-md border border-slate-600 object-contain"
                  />
                </div>
              ) : t.screenshot_url ? (
                <p className="shrink-0 text-xs text-amber-400/90 md:w-40">
                  Chart attached — could not load preview (check Storage policies).
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
