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
import { calculatePnl } from "@/lib/utils/trade-calculations";
import type { TradingSession } from "@/lib/types/trade";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ParsedRow = {
  _line: number;
  instrument: string;
  direction: "long" | "short";
  entry_price: number;
  exit_price: number;
  position_size: number;
  trade_date: string;
  session: TradingSession | null;
  setup_type: string | null;
  notes: string | null;
  pnl: number;
  errors: string[];
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const VALID_SESSIONS = new Set<string>(["london", "ny", "asian", "overnight"]);
const VALID_DIRECTIONS = new Set<string>(["long", "short"]);

const TEMPLATE_CSV =
  "instrument,direction,entry_price,exit_price,position_size,trade_date,session,setup_type,notes\r\n" +
  "NQ,long,18000,18050,1,2024-01-15T09:30:00,ny,FVG,Good setup\r\n" +
  "BTC,short,45000,44000,0.1,2024-01-16T14:00:00,london,OB,\r\n";

// ---------------------------------------------------------------------------
// CSV parsing helpers
// ---------------------------------------------------------------------------

function splitFields(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

function parseCSV(text: string): ParsedRow[] {
  const lines = text.trim().split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lines.length < 2) return [];

  const headers = splitFields(lines[0]).map((h) => h.toLowerCase().trim());

  const col = (name: string) => headers.indexOf(name);

  const idxMap = {
    instrument: col("instrument"),
    direction: col("direction"),
    entry_price: col("entry_price"),
    exit_price: col("exit_price"),
    position_size: col("position_size"),
    trade_date: col("trade_date"),
    session: col("session"),
    setup_type: col("setup_type"),
    notes: col("notes"),
  };

  const missingRequired = (["instrument", "direction", "entry_price", "exit_price", "position_size", "trade_date"] as const)
    .filter((k) => idxMap[k] === -1);

  if (missingRequired.length > 0) {
    // Return a sentinel with a global error
    return [{
      _line: 0,
      instrument: "",
      direction: "long",
      entry_price: 0,
      exit_price: 0,
      position_size: 0,
      trade_date: "",
      session: null,
      setup_type: null,
      notes: null,
      pnl: 0,
      errors: [`Missing required columns: ${missingRequired.join(", ")}`],
    }];
  }

  return lines.slice(1).map((line, i) => {
    const fields = splitFields(line);
    const get = (idx: number) => (idx >= 0 && idx < fields.length ? fields[idx] : "");
    const errors: string[] = [];

    const instrument = get(idxMap.instrument);
    if (!instrument) errors.push("instrument is required");
    else if (instrument.length > 50) errors.push("instrument must be ≤ 50 chars");

    const dirRaw = get(idxMap.direction).toLowerCase();
    if (!VALID_DIRECTIONS.has(dirRaw)) errors.push('direction must be "long" or "short"');
    const direction = dirRaw as "long" | "short";

    const entry_price = Number.parseFloat(get(idxMap.entry_price));
    if (!Number.isFinite(entry_price) || entry_price <= 0) errors.push("entry_price must be a number > 0");

    const exit_price = Number.parseFloat(get(idxMap.exit_price));
    if (!Number.isFinite(exit_price) || exit_price <= 0) errors.push("exit_price must be a number > 0");

    const position_size = Number.parseFloat(get(idxMap.position_size));
    if (!Number.isFinite(position_size) || position_size <= 0) errors.push("position_size must be a number > 0");

    const tradeDateRaw = get(idxMap.trade_date);
    let trade_date = "";
    if (!tradeDateRaw) {
      errors.push("trade_date is required");
    } else {
      const d = new Date(tradeDateRaw);
      if (Number.isNaN(d.getTime())) errors.push("trade_date is not a valid date");
      else trade_date = d.toISOString();
    }

    const sessionRaw = get(idxMap.session).toLowerCase();
    const session = VALID_SESSIONS.has(sessionRaw) ? (sessionRaw as TradingSession) : null;

    const setup_type = get(idxMap.setup_type) || null;
    const notes = get(idxMap.notes) || null;

    const pnl =
      errors.length === 0
        ? calculatePnl(direction, entry_price, exit_price, position_size)
        : 0;

    return {
      _line: i + 2,
      instrument,
      direction,
      entry_price,
      exit_price,
      position_size,
      trade_date,
      session,
      setup_type,
      notes,
      pnl,
      errors,
    };
  });
}

function downloadTemplate() {
  const blob = new Blob([TEMPLATE_CSV], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "traderpost-import-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type Props = { userId: string; className?: string };

export default function CsvImportModal({ userId, className }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [parsed, setParsed] = useState<ParsedRow[] | null>(null);
  const [fileName, setFileName] = useState("");
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  function reset() {
    setParsed(null);
    setFileName("");
    setImportResult(null);
    setImportError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleOpen(isOpen: boolean) {
    if (!isOpen) reset();
    setOpen(isOpen);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setImportResult(null);
    setImportError(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setParsed(parseCSV(text));
    };
    reader.readAsText(file);
  }

  async function handleImport() {
    if (!parsed) return;
    const validRows = parsed.filter((r) => r.errors.length === 0);
    if (validRows.length === 0) return;

    setImporting(true);
    setImportError(null);

    const { error } = await supabase.from("trades").insert(
      validRows.map((r) => ({
        user_id: userId,
        instrument: r.instrument,
        direction: r.direction,
        entry_price: r.entry_price,
        exit_price: r.exit_price,
        position_size: r.position_size,
        pnl: r.pnl,
        risk_reward_ratio: null,
        trade_date: r.trade_date,
        session: r.session,
        setup_type: r.setup_type,
        notes: r.notes,
        screenshot_url: null,
        emotion_tags: null,
        rating: null,
        strategy_id: null,
      })),
    );

    setImporting(false);

    if (error) {
      setImportError(error.message);
      return;
    }

    const skipped = parsed.length - validRows.length;
    setImportResult(
      `Imported ${validRows.length} trade${validRows.length !== 1 ? "s" : ""}` +
        (skipped > 0 ? ` (${skipped} row${skipped !== 1 ? "s" : ""} skipped due to errors)` : "") +
        ".",
    );
    router.refresh();
  }

  const validCount = parsed ? parsed.filter((r) => r.errors.length === 0).length : 0;
  const errorCount = parsed ? parsed.filter((r) => r.errors.length > 0).length : 0;

  const thClass = "px-3 py-2 text-left text-xs font-medium text-slate-400 whitespace-nowrap";
  const tdClass = "px-3 py-2 text-xs text-slate-200 whitespace-nowrap";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`h-12 rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:border-[#00C896] hover:text-[#00C896] transition-colors${className ? ` ${className}` : ""}`}
      >
        Import CSV
      </button>

      <Dialog open={open} onOpenChange={handleOpen}>
        <DialogContent className="max-h-[90vh] w-[95vw] max-w-3xl overflow-y-auto bg-[#0F1923] text-slate-100 ring-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Import trades from CSV</DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {/* Template download */}
            <div className="rounded-md border border-slate-700 bg-[#1E2D3D] p-4">
              <p className="text-sm text-slate-300">
                Your CSV must include these columns:{" "}
                <span className="font-mono text-xs text-slate-400">
                  instrument, direction, entry_price, exit_price, position_size, trade_date
                </span>{" "}
                (required).{" "}
                <span className="font-mono text-xs text-slate-400">
                  session, setup_type, notes
                </span>{" "}
                are optional.
              </p>
              <button
                type="button"
                onClick={downloadTemplate}
                className="mt-3 text-sm text-[#00C896] underline hover:opacity-80"
              >
                Download template CSV
              </button>
            </div>

            {/* File input */}
            <div>
              <label className="block text-sm text-slate-200">
                Select CSV file
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="mt-1 w-full rounded-md border border-slate-600 bg-[#1E2D3D] px-3 py-2 text-slate-100 text-sm outline-none focus:border-[#00C896] cursor-pointer file:mr-3 file:rounded file:border-0 file:bg-slate-700 file:px-3 file:py-1 file:text-sm file:text-slate-200"
                  onChange={handleFile}
                />
              </label>
              {fileName && (
                <p className="mt-1 text-xs text-slate-400">Loaded: {fileName}</p>
              )}
            </div>

            {/* Preview */}
            {parsed !== null && parsed.length === 0 && (
              <p className="text-sm text-slate-400">No data rows found in this file.</p>
            )}

            {parsed !== null && parsed.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-300">
                    {parsed.length} row{parsed.length !== 1 ? "s" : ""} parsed
                  </span>
                  {validCount > 0 && (
                    <span className="text-[#00C896]">{validCount} valid</span>
                  )}
                  {errorCount > 0 && (
                    <span className="text-red-400">{errorCount} with errors</span>
                  )}
                </div>

                <div className="overflow-x-auto rounded-md border border-slate-700">
                  <table className="w-full min-w-[720px] border-collapse text-sm">
                    <thead className="bg-[#1E2D3D]">
                      <tr>
                        <th className={thClass}>#</th>
                        <th className={thClass}>Instrument</th>
                        <th className={thClass}>Dir</th>
                        <th className={thClass}>Entry</th>
                        <th className={thClass}>Exit</th>
                        <th className={thClass}>Size</th>
                        <th className={thClass}>PnL</th>
                        <th className={thClass}>Date</th>
                        <th className={thClass}>Session</th>
                        <th className={thClass}>Setup</th>
                        <th className={thClass}>Issues</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsed.map((row) => {
                        const hasError = row.errors.length > 0;
                        const rowClass = hasError
                          ? "border-t border-slate-700 bg-red-950/30"
                          : "border-t border-slate-700 hover:bg-[#1E2D3D]/60";
                        return (
                          <tr key={row._line} className={rowClass}>
                            <td className={`${tdClass} text-slate-500`}>{row._line}</td>
                            <td className={tdClass}>{row.instrument || <span className="text-slate-500">—</span>}</td>
                            <td className={tdClass}>
                              {row.direction && (
                                <span className={row.direction === "long" ? "text-[#00C896]" : "text-red-400"}>
                                  {row.direction}
                                </span>
                              )}
                            </td>
                            <td className={`${tdClass} font-mono`}>{Number.isFinite(row.entry_price) && row.entry_price > 0 ? row.entry_price : <span className="text-slate-500">—</span>}</td>
                            <td className={`${tdClass} font-mono`}>{Number.isFinite(row.exit_price) && row.exit_price > 0 ? row.exit_price : <span className="text-slate-500">—</span>}</td>
                            <td className={`${tdClass} font-mono`}>{Number.isFinite(row.position_size) && row.position_size > 0 ? row.position_size : <span className="text-slate-500">—</span>}</td>
                            <td className={tdClass}>
                              {row.errors.length === 0 ? (
                                <span className={row.pnl >= 0 ? "text-[#00C896]" : "text-red-400"}>
                                  {row.pnl.toFixed(2)}
                                </span>
                              ) : <span className="text-slate-500">—</span>}
                            </td>
                            <td className={tdClass}>
                              {row.trade_date
                                ? new Date(row.trade_date).toLocaleDateString()
                                : <span className="text-slate-500">—</span>}
                            </td>
                            <td className={tdClass}>{row.session ?? <span className="text-slate-500">—</span>}</td>
                            <td className={tdClass}>{row.setup_type ?? <span className="text-slate-500">—</span>}</td>
                            <td className="px-3 py-2 text-xs text-red-400 max-w-[180px]">
                              {row.errors.join("; ")}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {importResult && (
                  <p className="text-sm text-[#00C896]">{importResult}</p>
                )}
                {importError && (
                  <p className="text-sm text-red-400">Import failed: {importError}</p>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleImport}
                    disabled={importing || validCount === 0 || !!importResult}
                    className="rounded-md bg-[#00C896] px-5 py-2.5 text-sm font-medium text-slate-950 hover:opacity-90 disabled:opacity-50"
                  >
                    {importing
                      ? "Importing..."
                      : importResult
                        ? "Imported"
                        : `Import ${validCount} trade${validCount !== 1 ? "s" : ""}`}
                  </button>
                  <button
                    type="button"
                    onClick={reset}
                    className="rounded-md border border-slate-600 px-5 py-2.5 text-sm text-slate-200 hover:bg-slate-800"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
