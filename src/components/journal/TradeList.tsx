"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatNum, type TradeListRow } from "@/lib/journal/trade-list";
import { cn } from "@/lib/utils";

type TradeListProps = {
  trades: TradeListRow[];
  onEdit?: (trade: TradeListRow) => void;
  onDelete?: (trade: TradeListRow) => void;
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

export default function TradeList({ trades, onEdit, onDelete }: TradeListProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedScreenshot, setLightboxUrl] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<TradeListRow | null>(null);

  function openLightbox(url: string, title: string) {
    setLightboxUrl(url);
    setLightboxTitle(title);
    setLightboxOpen(true);
  }

  function onLightboxOpenChange(open: boolean) {
    setLightboxOpen(open);
    if (!open) setLightboxUrl(null);
  }

  function confirmDelete(trade: TradeListRow) {
    setDeleteTarget(trade);
  }

  function handleDeleteConfirm() {
    if (deleteTarget && onDelete) {
      onDelete(deleteTarget);
    }
    setDeleteTarget(null);
  }

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
        Click a thumbnail to view full size.
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
                  <div className="ml-auto flex gap-2">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(t)}
                        className="rounded px-2 py-0.5 text-xs text-slate-400 border border-slate-600 hover:border-[#00C896] hover:text-[#00C896] transition-colors"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => confirmDelete(t)}
                        className="rounded px-2 py-0.5 text-xs text-slate-400 border border-slate-600 hover:border-red-500 hover:text-red-400 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
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
                  <button
                    type="button"
                    onClick={() =>
                      openLightbox(
                        t.screenshotSignedUrl!,
                        `${t.instrument} chart — ${formatDate(t.trade_date)}`,
                      )
                    }
                    className={cn(
                      "group w-full rounded-md border border-slate-600 bg-slate-900/50 text-left",
                      "transition hover:border-[#00C896]/60 focus-visible:border-[#00C896] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00C896]/40",
                    )}
                    aria-label={`View full chart for ${t.instrument}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.screenshotSignedUrl}
                      alt={`${t.instrument} chart thumbnail`}
                      className="max-h-40 w-full cursor-zoom-in rounded-md object-contain"
                    />
                    <span className="block px-2 py-1 text-center text-xs text-slate-500 group-hover:text-slate-400">
                      Click to enlarge
                    </span>
                  </button>
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

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={onLightboxOpenChange}>
        <DialogTitle className="sr-only">{lightboxTitle || "Chart preview"}</DialogTitle>
        <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] max-h-[95vh] p-0 border-0 bg-black flex items-center justify-center overflow-hidden">
          {selectedScreenshot && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={selectedScreenshot} alt="Trade chart" className="w-full h-full object-contain" />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={deleteTarget !== null} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent className="max-w-sm bg-[#1E2D3D] text-slate-100 ring-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Delete trade?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-300">
            This will permanently delete the{" "}
            <span className="font-semibold text-white">{deleteTarget?.instrument}</span> trade.
            This action cannot be undone.
          </p>
          <DialogFooter className="bg-transparent border-0 px-0 pb-0">
            <button
              type="button"
              className="rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              onClick={handleDeleteConfirm}
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
