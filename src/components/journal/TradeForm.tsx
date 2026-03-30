"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { TradeDirection, TradingSession } from "@/lib/types/trade";
import { calculatePnl, calculateRiskRewardRatio } from "@/lib/utils/trade-calculations";
import {
  INSTRUMENT_GROUPS,
  SESSIONS,
  EMOTION_OPTIONS,
  SETUP_SUGGESTIONS,
} from "@/lib/journal/trade-constants";
import CsvImportModal from "@/components/journal/CsvImportModal";

const SCREENSHOT_BUCKET = "trade-screenshots";
const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

type StrategyOption = { id: string; name: string };

type TradeFormProps = {
  userId: string;
  strategies: StrategyOption[];
};

function parseNumber(value: string): number | null {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : null;
}

export default function TradeForm({ userId, strategies }: TradeFormProps) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const screenshotInputRef = useRef<HTMLInputElement>(null);

  const [instrumentPreset, setInstrumentPreset] = useState("NQ");
  const [instrumentCustom, setInstrumentCustom] = useState("");
  const [direction, setDirection] = useState<TradeDirection>("long");
  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");
  const [positionSize, setPositionSize] = useState("");
  const [riskDollars, setRiskDollars] = useState("");
  const [tradeDate, setTradeDate] = useState(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours(),
    )}:${pad(d.getMinutes())}`;
  });
  const [session, setSession] = useState<TradingSession | "">("ny");
  const [setupType, setSetupType] = useState("");
  const [strategyId, setStrategyId] = useState("");
  const [emotionTags, setEmotionTags] = useState<string[]>([]);
  const [rating, setRating] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const instrument =
      instrumentPreset === "Other"
        ? instrumentCustom.trim()
        : instrumentPreset;

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

    const pnl = calculatePnl(direction, entry, exit, size);
    const riskParsed = parseNumber(riskDollars);
    const rr = calculateRiskRewardRatio(pnl, riskParsed);

    const tradeDateIso = new Date(tradeDate).toISOString();

    let ratingValue: number | null = null;
    if (rating !== "") {
      ratingValue = rating;
      if (ratingValue < 1 || ratingValue > 5) {
        setError("Rating must be between 1 and 5.");
        return;
      }
    }

    let screenshotPath: string | null = null;

    if (screenshotFile) {
      if (screenshotFile.size > MAX_SCREENSHOT_BYTES) {
        setError("Chart image must be 5 MB or smaller.");
        return;
      }
      if (!ALLOWED_IMAGE_TYPES.has(screenshotFile.type)) {
        setError("Use PNG, JPEG, WebP, or GIF for the chart screenshot.");
        return;
      }

      const extFromName = screenshotFile.name.split(".").pop()?.toLowerCase();
      const ext =
        extFromName === "jpg" || extFromName === "jpeg"
          ? "jpeg"
          : extFromName === "png" || extFromName === "webp" || extFromName === "gif"
            ? extFromName
            : screenshotFile.type === "image/png"
              ? "png"
              : screenshotFile.type === "image/webp"
                ? "webp"
                : screenshotFile.type === "image/gif"
                  ? "gif"
                  : "jpeg";

      screenshotPath = `${userId}/${crypto.randomUUID()}.${ext}`;

      setLoading(true);

      const { error: uploadError } = await supabase.storage
        .from(SCREENSHOT_BUCKET)
        .upload(screenshotPath, screenshotFile, {
          contentType: screenshotFile.type || undefined,
          upsert: false,
        });

      if (uploadError) {
        setLoading(false);
        setError(uploadError.message);
        return;
      }
    } else {
      setLoading(true);
    }

    const { error: insertError } = await supabase.from("trades").insert({
      user_id: userId,
      strategy_id: strategyId || null,
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
      emotion_tags: emotionTags.length ? emotionTags : null,
      rating: ratingValue,
      notes: notes.trim() || null,
      screenshot_url: screenshotPath,
    });

    setLoading(false);

    if (insertError) {
      if (screenshotPath) {
        await supabase.storage.from(SCREENSHOT_BUCKET).remove([screenshotPath]);
      }
      setError(insertError.message);
      return;
    }

    setSuccess("Trade saved.");
    setNotes("");
    setSetupType("");
    setStrategyId("");
    setEmotionTags([]);
    setRating("");
    setRiskDollars("");
    setScreenshotFile(null);
    if (screenshotInputRef.current) {
      screenshotInputRef.current.value = "";
    }
    router.refresh();
  }

  const inputClass =
    "mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-[#00C896]";

  return (
    <form className="mt-6 max-w-2xl space-y-5" onSubmit={onSubmit}>
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

        {instrumentPreset === "Other" ? (
          <label className="block text-sm text-slate-200 md:col-span-1">
            Custom instrument
            <input
              type="text"
              className={inputClass}
              value={instrumentCustom}
              onChange={(e) => setInstrumentCustom(e.target.value)}
              placeholder="e.g. CL"
              maxLength={50}
            />
          </label>
        ) : null}

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

        <div className="md:col-span-2 rounded-md border border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-300">
          <p>
            <span className="text-slate-400">PnL (preview): </span>
            <span className={pnlPreview != null && pnlPreview >= 0 ? "text-[#00C896]" : "text-red-400"}>
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
            list="setup-suggestions"
            placeholder="e.g. FVG, OB"
          />
          <datalist id="setup-suggestions">
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

      <label className="block text-sm text-slate-200">
        Chart screenshot (optional)
        <input
          ref={screenshotInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className={`${inputClass} cursor-pointer file:mr-3 file:rounded file:border-0 file:bg-slate-700 file:px-3 file:py-1 file:text-sm file:text-slate-200`}
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            setScreenshotFile(file);
          }}
        />
        <span className="mt-1 block text-xs text-slate-500">
          PNG, JPEG, WebP, or GIF. Max 5 MB. Stored in Supabase Storage under your user folder.
        </span>
      </label>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-400">{success}</p> : null}

      <div className="flex flex-wrap items-center gap-3">
        <CsvImportModal userId={userId} className="flex-1" />
        <button
          type="submit"
          className="flex-1 h-12 rounded-md bg-[#00C896] px-5 font-medium text-slate-950 hover:opacity-90 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save trade"}
        </button>
      </div>
    </form>
  );
}
