"use client";

import { useMemo } from "react";
import { useAccessData } from "./AccessDataContext";

function normalizeDirection(dir) {
  if (typeof dir !== "string") return "OUT";
  const upper = dir.toUpperCase();
  return upper === "IN" ? "IN" : "OUT";
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
      (a, b) => b.in.count + b.out.count - (a.in.count + a.out.count)
    );
  }, [catData]);

  const maxValue = useMemo(() => {
    const allCounts = rows.flatMap((r) => [r.in.count, r.out.count]);
    return allCounts.length ? Math.max(...allCounts, 1) : 1;
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
        <div className="grid grid-cols-[1fr_auto] items-center gap-3 text-xs font-semibold">
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-[color:var(--egg-white)]">
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all"
              style={{ width: `${widthCount}%`, backgroundColor: colors.total }}
            />
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all"
              style={{ width: `${widthUnique}%`, backgroundColor: colors.unique }}
            />
            <div className="absolute inset-0 flex items-center pl-2 text-[10px] font-bold text-[color:var(--text-primary)]">
              {dirLabel}
            </div>
          </div>
          <div className="grid grid-cols-2 min-w-[120px] text-right font-bold">
            <span className="text-[color:var(--electric-blue)]">{data.unique}</span>
            <span className="text-[color:var(--primary-orange)]">{data.count}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-3xl border border-[color:var(--border-light)] bg-[color:var(--bg-secondary)] p-6 shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-xl)] transition-all">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-[family-name:var(--font-chillax)] font-semibold 
                       bg-gradient-to-r from-[color:var(--electric-blue)] to-[color:var(--primary-orange)] 
                       bg-clip-text text-transparent">
          Category Count
        </h3>
        <div className="grid grid-cols-2 text-xs font-bold uppercase tracking-wide min-w-[130px] text-right">
          <span className="text-[color:var(--electric-blue)]">Unique</span>
          <span className="text-[color:var(--primary-orange)]">Total</span>
        </div>
      </div>

      {error && (
        <div className="mb-3 rounded-lg border border-[color:var(--accent-red)] bg-[rgba(233,65,32,0.08)] px-3 py-2 text-sm text-[color:var(--accent-red)]">
          {error}
        </div>
      )}

      {loading && <p className="text-sm text-[color:var(--text-secondary)]">Loading categories…</p>}

      {!loading && rows.length === 0 && !error && (
        <p className="text-sm text-[color:var(--text-secondary)]">No category data.</p>
      )}

      <div
        className={`space-y-3 ${scrollable ? "max-h-72 overflow-y-scroll pr-1" : ""}`}
        style={
          scrollable
            ? {
                scrollbarWidth: "thin",
                scrollbarColor: "var(--electric-blue) transparent",
                scrollbarGutter: "stable"
              }
            : undefined
        }
      >
        {rows.map((row) => (
          <div
            key={row.label}
            className="space-y-2 rounded-2xl p-3 border border-[color:var(--border-light)] bg-[rgba(0,0,0,0.02)] hover:shadow-[var(--shadow-md)] transition-all"
          >
            <div className="text-sm font-semibold 
                            bg-gradient-to-r from-[color:var(--electric-blue)] to-[color:var(--primary-orange)] 
                            bg-clip-text text-transparent truncate pr-2">
              {row.label}
            </div>
            {renderBar("IN", row.in, { total: "rgba(0,169,242,0.25)", unique: "var(--electric-blue)" }, `${row.label}-in`)}
            {renderBar("OUT", row.out, { total: "rgba(224,68,32,0.25)", unique: "var(--primary-orange)" }, `${row.label}-out`)}
          </div>
        ))}
      </div>
    </div>
  );
}
