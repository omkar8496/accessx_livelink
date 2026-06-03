"use client";

import { useMemo } from "react";
import { useAccessData } from "./AccessDataContext";

function normalizeDirection(dir) {
  if (typeof dir !== "string") return "OUT";
  const upper = dir.toUpperCase();
  if (upper === "IN") return "IN";
  return "OUT";
}

export function CateUniqueCount() {
  const { catData, loading, error } = useAccessData();

  const rows = useMemo(() => {
    const aggregated = catData.reduce((acc, item) => {
      const cat = item.category_name || "Unknown";
      const dir = normalizeDirection(item.direction);
      const prev = acc.get(cat) || {
        label: cat,
        in: { count: 0, unique: 0 },
        out: { count: 0, unique: 0 }
      };

      const countVal = Number(item.count) || 0;
      const uniqueVal = Number(item.unique_count) || 0;

      if (dir === "IN") {
        prev.in.count += countVal;
        prev.in.unique += uniqueVal;
      } else {
        prev.out.count += countVal;
        prev.out.unique += uniqueVal;
      }

      acc.set(cat, prev);
      return acc;
    }, new Map());

    return Array.from(aggregated.values()).sort(
      (a, b) =>
        b.in.count + b.out.count - (a.in.count + a.out.count)
    );
  }, [catData]);

  const maxValue = useMemo(() => {
    const allCounts = rows.flatMap((r) => [r.in.count, r.out.count]);
    if (!allCounts.length) return 1;
    return Math.max(...allCounts, 1);
  }, [rows]);

  const scrollable = rows.length > 5;

  const renderBar = (dirLabel, data, colors, key) => {
    if (!data.count && !data.unique) return null;
    const widthCount = Math.max((data.count / maxValue) * 100, 2);
    const widthUnique = Math.min(
      Math.max((data.unique / maxValue) * 100, 2),
      widthCount
    );
    return (
      <div key={key} className="space-y-1">
        <div className="grid grid-cols-[1fr_auto] items-center gap-3 text-[11px] font-semibold">
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-[#f3f4f6]">
            <div
              className="absolute left-0 top-0 h-full rounded-full"
              style={{ width: `${widthCount}%`, backgroundColor: colors.total }}
            />
            <div
              className="absolute left-0 top-0 h-full rounded-full"
              style={{
                width: `${widthUnique}%`,
                backgroundColor: colors.unique
              }}
            />
            <div className="absolute inset-0 flex items-center pl-2 text-[11px] font-semibold text-slate-900">
              {dirLabel}
            </div>
          </div>
          <div className="grid grid-cols-2 min-w-[120px] text-right font-bold">
            <span className="text-[#2f9aa8]">{data.unique}</span>
            <span className="text-[#ef4444]">{data.count}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-3xl border border-[#F2F2F2] bg-white p-6 shadow-lg transition-all hover:shadow-xl">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-[family-name:var(--font-chillax)] font-semibold text-slate-900">Catg Count</h3>
        <div className="grid grid-cols-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-600 min-w-[140px] text-right">
          <span className="text-[var(--light-blue)] -mr-2">Unique</span>
          <span className="text-[var(--primary-orange)]">Total</span>
        </div>
      </div>

      {error && (
        <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && <p className="text-sm text-slate-600">Loading catagories…</p>}

      {!loading && rows.length === 0 && !error && (
        <p className="text-sm text-slate-600">No category data.</p>
      )}

      <div
        className={`space-y-4 ${scrollable ? "max-h-72 overflow-y-scroll pr-1" : ""}`}
        style={
          scrollable
            ? {
                scrollbarWidth: "thin",
                scrollbarColor: "#cbd5e1 transparent",
                scrollbarGutter: "stable"
              }
            : undefined
        }
      >
        {rows.map((row) => (
          <div key={row.label} className="space-y-2 rounded-2xl border border-[#f1f1f1] bg-[#fafafa]">
            <div className="text-sm font-medium text-slate-800 truncate pr-2 tracking-wide">{row.label}</div>
            {renderBar("IN", row.in, { total: "#d7eff3", unique: "#2f9aa8" }, `${row.label}-in`)}
            {renderBar("OUT", row.out, { total: "#fde7d2", unique: "#f58633" }, `${row.label}-out`)}
          </div>
        ))}
      </div>
    </div>
  );
}
