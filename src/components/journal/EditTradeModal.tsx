"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  INSTRUMENT_GROUPS,
  ALL_PRESET_INSTRUMENTS,
  SESSIONS,
  EMOTION_OPTIONS,
  SETUP_SUGGESTIONS,
} from "@/lib/journal/trade-constants";
import { calculatePnl, calculateRiskRewardRatio } from "@/lib/utils/trade-calculations";
import type { TradeDirection, TradingSession } from "@/lib/types/trade";
import type { TradeListRow } from "@/lib/journal/trade-list";

const SCREENSHOT_BUCKET = "trade-screenshots";
const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

type Props = {
  trade: TradeListRow;
  strategies: { id: string; name: string }[];
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function parseNumber(value: string): number | null {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : null;
}

function toDatetimeLocal(iso: string): string {
  try {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return iso;
  }
}

const inputClass =
  "mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-[#00C896]";

export default function EditTradeModal({ trade, strategies, userId, open, onOpenChange }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const screenshotInputRef = useRef<HTMLInputElement>(null);

  const initialPreset = ALL_PRESET_INSTRUMENTS.includes(trade.instrument)
    ? trade.instrument
    : "Other";

  const [instrumentPreset, setInstrumentPreset] = useState(initialPreset);
  const [instrumentCustom, setInstrumentCustom] = useState(
    initialPreset === "Other" ? trade.instrument : "",
  );
  const [direction, setDirection] = useState<TradeDirection>(
    trade.direction as TradeDirection,
  );
  const [entryPrice, setEntryPrice] = useState(String(trade.entry_price));
  const [exitPrice, setExitPrice] = useState(String(trade.exit_price));
  const [positionSize, setPositionSize] = useState(String(trade.position_size));
  const [riskDollars, setRiskDollars] = useState("");
  const [tradeDate, setTradeDate] = useState(toDatetimeLocal(trade.trade_date));
  const [session, setSession] = useState<TradingSession | "">(
    (trade.session as TradingSession) ?? "",
  );
  const [setupType, setSetupType] = useState(trade.setup_type ?? "");
  const [strategyId, setStrategyId] = useState("");
  const [emotionTags, setEmotionTags] = useState<string[]>(trade.emotion_tags ?? []);
  const [rating, setRating] = useState<number | "">(trade.rating ?? "");
  const [notes, setNotes] = useState(trade.notes ?? "");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [removeScreenshot, setRemoveScreenshot] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const entry = parseNumber(entryPrice);
  const exit = parseNumber(exitPrice);
  const size = parseNumber(positionSize);
  const risk = parseNumber(riskDollars);

  const pnlPreview =
    entry != null && exit != null && size != null && size > 0
      ? calculatePnl(direction, entry, exit, size)
      : null;

  const rrPreview =
    pnlPreview != null ? calculateRiskRewardRatio(pnlPreview, risk ?? null) : null;

  function toggleEmotion(tag: string) {
    setEmotionTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const instrument =
      instrumentPreset === "Other" ? instrumentCustom.trim() : instrumentPreset;

    if (!instrument) {
      setError("Instrument is required.");
      return;
    }
    if (instrument.length > 50) {
      setError("Instrument must be 50 characters or fewer.");
      return;
    }
    if (entry == null || exit == null || size == null) {
      setError("Entry, exit, and position size must be valid numbers.");
      return;
    }
    if (size <= 0 || entry <= 0 || exit <= 0) {
      setError("Prices and position size must be greater than zero.");
      return;
    }

    let ratingValue: number | null = null;
    if (rating !== "") {
      ratingValue = rating;
      if (ratingValue < 1 || ratingValue > 5) {
        setError("Rating must be between 1 and 5.");
        return;
      }
    }

    const pnl = calculatePnl(direction, entry, exit, size);
    const rr = calculateRiskRewardRatio(pnl, risk ?? null);
    const tradeDateIso = new Date(tradeDate).toISOString();

    // screenshot_url: undefined = no change, null = remove, string = new path
    let newScreenshotUrl: string | null | undefined = undefined;

    if (screenshotFile) {
      if (screenshotFile.size > MAX_SCREENSHOT_BYTES) {
        setError("Chart image must be 5 MB or smaller.");
        return;
      }
      if (!ALLOWED_IMAGE_TYPES.has(screenshotFile.type)) {
        setError("Use PNG, JPEG, WebP, or GIF for the chart screenshot.");
        return;
      }
    }

    setLoading(true);

    if (removeScreenshot) {
      if (trade.screenshot_url) {
        await supabase.storage.from(SCREENSHOT_BUCKET).remove([trade.screenshot_url]);
      }
      newScreenshotUrl = null;
    } else if (screenshotFile) {
      const extFromName = screenshotFile.name.split(".").pop()?.toLowerCase();
      const ext =
        extFromName === "jpg" || extFromName === "jpeg" ? "jpeg"
        : extFromName === "png" || extFromName === "webp" || extFromName === "gif" ? extFromName
        : screenshotFile.type === "image/png" ? "png"
        : screenshotFile.type === "image/webp" ? "webp"
        : screenshotFile.type === "image/gif" ? "gif"
        : "jpeg";

      const uploadPath = `${userId}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(SCREENSHOT_BUCKET)
        .upload(uploadPath, screenshotFile, { contentType: screenshotFile.type || undefined, upsert: false });

      if (uploadError) {
        setLoading(false);
        setError(uploadError.message);
        return;
      }

      // Delete old screenshot after successful upload
      if (trade.screenshot_url) {
        await supabase.storage.from(SCREENSHOT_BUCKET).remove([trade.screenshot_url]);
      }

      newScreenshotUrl = uploadPath;
    }

    const { error: updateError } = await supabase
      .from("trades")
      .update({
        instrument,
        direction,
        entry_price: entry,
        exit_price: exit,
        position_size: size,
        pnl,
        risk_reward_ratio: rr,
        trade_date: tradeDateIso,
        session: session || null,
        setup_type: setupType.trim() || null,
        strategy_id: strategyId || null,
        emotion_tags: emotionTags.length ? emotionTags : null,
        rating: ratingValue,
        notes: notes.trim() || null,
        ...(newScreenshotUrl !== undefined ? { screenshot_url: newScreenshotUrl } : {}),
      })
      .eq("id", trade.id);

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-2xl overflow-y-auto bg-[#1E2D3D] text-slate-100 ring-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">Edit trade</DialogTitle>
        </DialogHeader>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm text-slate-200">
              Instrument
              <select
                className={inputClass}
                value={instrumentPreset}
                onChange={(e) => setInstrumentPreset(e.target.value)}
              >
                {INSTRUMENT_GROUPS.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.instruments.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>

            {instrumentPreset === "Other" && (
              <label className="block text-sm text-slate-200">
                Custom instrument
                <input
                  type="text"
                  className={inputClass}
                  value={instrumentCustom}
                  onChange={(e) => setInstrumentCustom(e.target.value)}
                  maxLength={50}
                />
              </label>
            )}

            <div className="block text-sm text-slate-200 md:col-span-2">
              <span className="block">Direction</span>
              <div className="mt-2 flex gap-2">
                {(["long", "short"] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`rounded-md px-4 py-2 text-sm font-medium capitalize ${
                      direction === d
                        ? "bg-[#00C896] text-slate-950"
                        : "border border-slate-600 bg-slate-900 text-slate-200 hover:bg-slate-800"
                    }`}
                    onClick={() => setDirection(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <label className="block text-sm text-slate-200">
              Entry price
              <input
                type="number"
                step="any"
                min="0"
                className={inputClass}
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                required
              />
            </label>

            <label className="block text-sm text-slate-200">
              Exit price
              <input
                type="number"
                step="any"
                min="0"
                className={inputClass}
                value={exitPrice}
                onChange={(e) => setExitPrice(e.target.value)}
                required
              />
            </label>

            <label className="block text-sm text-slate-200">
              Position size
              <input
                type="number"
                step="any"
                min="0"
                className={inputClass}
                value={positionSize}
                onChange={(e) => setPositionSize(e.target.value)}
                required
              />
            </label>

            <label className="block text-sm text-slate-200">
              Risk ($) — optional, for R-multiple
              <input
                type="number"
                step="any"
                min="0"
                className={inputClass}
                value={riskDollars}
                onChange={(e) => setRiskDollars(e.target.value)}
                placeholder="Planned max loss in dollars"
              />
            </label>

            <div className="rounded-md border border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-300 md:col-span-2">
              <p>
                <span className="text-slate-400">PnL (preview): </span>
                <span
                  className={
                    pnlPreview != null && pnlPreview >= 0 ? "text-[#00C896]" : "text-red-400"
                  }
                >
                  {pnlPreview == null ? "—" : pnlPreview.toFixed(2)}
                </span>
              </p>
              <p className="mt-1">
                <span className="text-slate-400">R-multiple (preview): </span>
                {rrPreview == null ? "—" : rrPreview.toFixed(2)}
              </p>
            </div>

            <label className="block text-sm text-slate-200">
              Trade date &amp; time
              <input
                type="datetime-local"
                className={inputClass}
                value={tradeDate}
                onChange={(e) => setTradeDate(e.target.value)}
                required
              />
            </label>

            <label className="block text-sm text-slate-200">
              Session
              <select
                className={inputClass}
                value={session}
                onChange={(e) => setSession(e.target.value as TradingSession | "")}
              >
                <option value="">—</option>
                {SESSIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm text-slate-200 md:col-span-2">
              Setup type
              <input
                type="text"
                className={inputClass}
                value={setupType}
                onChange={(e) => setSetupType(e.target.value)}
                list="edit-setup-suggestions"
                placeholder="e.g. FVG, OB"
              />
              <datalist id="edit-setup-suggestions">
                {SETUP_SUGGESTIONS.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </label>

            <label className="block text-sm text-slate-200 md:col-span-2">
              Strategy (optional)
              <select
                className={inputClass}
                value={strategyId}
                onChange={(e) => setStrategyId(e.target.value)}
              >
                <option value="">— None —</option>
                {strategies.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="md:col-span-2">
              <span className="text-sm text-slate-200">Emotion tags</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {EMOTION_OPTIONS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleEmotion(tag)}
                    className={`rounded-full px-3 py-1 text-xs capitalize ${
                      emotionTags.includes(tag)
                        ? "bg-[#00C896] text-slate-950"
                        : "border border-slate-600 bg-slate-900 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <label className="block text-sm text-slate-200">
              Plan follow-through (1–5)
              <select
                className={inputClass}
                value={rating}
                onChange={(e) =>
                  setRating(e.target.value === "" ? "" : Number.parseInt(e.target.value, 10))
                }
              >
                <option value="">—</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block text-sm text-slate-200">
            Notes
            <textarea
              className={`${inputClass} min-h-[100px]`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </label>

          <div className="space-y-3">
            <span className="block text-sm text-slate-200">Chart screenshot</span>

            {trade.screenshotSignedUrl && !removeScreenshot && !screenshotFile && (
              <div className="space-y-2">
                <p className="text-xs text-slate-400">Current screenshot</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={trade.screenshotSignedUrl}
                  alt="Current chart screenshot"
                  className="max-h-40 w-full rounded-md border border-slate-600 object-contain bg-slate-900/50"
                />
              </div>
            )}

            {removeScreenshot && (
              <p className="text-xs text-amber-400">Screenshot will be removed on save.</p>
            )}

            <label className="block text-sm text-slate-200">
              {trade.screenshot_url && !removeScreenshot ? "Replace screenshot" : "Upload screenshot"}
              <input
                ref={screenshotInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className={`${inputClass} cursor-pointer file:mr-3 file:rounded file:border-0 file:bg-slate-700 file:px-3 file:py-1 file:text-sm file:text-slate-200`}
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setScreenshotFile(file);
                  if (file) setRemoveScreenshot(false);
                }}
              />
              <span className="mt-1 block text-xs text-slate-500">PNG, JPEG, WebP, or GIF. Max 5 MB.</span>
            </label>

            {trade.screenshot_url && !removeScreenshot && (
              <button
                type="button"
                className="text-xs text-red-400 hover:text-red-300 underline"
                onClick={() => {
                  setRemoveScreenshot(true);
                  setScreenshotFile(null);
                  if (screenshotInputRef.current) screenshotInputRef.current.value = "";
                }}
              >
                Remove screenshot
              </button>
            )}

            {removeScreenshot && (
              <button
                type="button"
                className="text-xs text-slate-400 hover:text-slate-200 underline"
                onClick={() => setRemoveScreenshot(false)}
              >
                Undo remove
              </button>
            )}
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-md bg-[#00C896] px-5 py-2.5 font-medium text-slate-950 hover:opacity-90 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
            <button
              type="button"
              className="rounded-md border border-slate-600 px-5 py-2.5 text-slate-200 hover:bg-slate-800"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
