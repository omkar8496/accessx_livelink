"use client";

import { useMemo } from "react";
import { useAccessData } from "./AccessDataContext";

function normalizeDirection(dir) {
  if (typeof dir !== "string") return "OUT";
  const upper = dir.toUpperCase();
  return upper === "IN" ? "IN" : "OUT";
}

export function GateUniqueCount() {
  const { gateData, loading, error } = useAccessData();

  const rows = useMemo(() => {
    const aggregated = gateData.reduce((acc, item) => {
      const gate = item.name || "Unknown";
      const dir = normalizeDirection(item.direction);
      const prev = acc.get(gate) || {
        label: gate,
        in: { count: 0, unique: 0 },
        out: { count: 0, unique: 0 },
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

      acc.set(gate, prev);
      return acc;
    }, new Map());

    return Array.from(aggregated.values()).sort(
      (a, b) => b.in.count + b.out.count - (a.in.count + a.out.count),
    );
  }, [gateData]);

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
      widthCount,
    );
    return (
      <div key={key} className="space-y-1">
        <div className="grid grid-cols-[1fr_auto] items-center gap-3 text-xs font-semibold">
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-(--egg-white)">
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all"
              style={{ width: `${widthCount}%`, backgroundColor: colors.total }}
            />
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all"
              style={{
                width: `${widthUnique}%`,
                backgroundColor: colors.unique,
              }}
            />
            <div className="absolute inset-0 flex items-center pl-2 text-[10px] font-bold text-(--text-primary)">
              {dirLabel}
            </div>
          </div>
          <div className="grid grid-cols-2 min-w-30 text-right font-bold">
            <span className="text-(--light-blue)">{data.unique}</span>
            <span className="text-(--primary-orange)">{data.count}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-3xl border border-(--border-light) bg-[#FEEBDF] p-6 shadow-(--shadow-lg) hover:shadow-(--shadow-xl) transition-all">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-(family-name:--font-chillax) font-semibold text-(--text-primary)">
          Gate Count
        </h3>
        <div className="grid grid-cols-2 text-xs font-bold uppercase tracking-wide min-w-35 text-right">
          <span className="text-(--light-blue)">Unique</span>
          <span className="text-(--primary-orange)">Total</span>
        </div>
      </div>

      {error && (
        <div className="mb-3 rounded-lg border border-(--accent-red) bg-[rgba(233,65,32,0.08)] px-3 py-2 text-sm text-(--accent-red)">
          {error}
        </div>
      )}

      {loading && (
        <p className="text-sm text-(--text-secondary)">Loading gates…</p>
      )}

      {!loading && rows.length === 0 && !error && (
        <p className="text-sm text-(--text-secondary)">No gate data.</p>
      )}

      <div
        className={`space-y-4 ${scrollable ? "max-h-72 overflow-y-scroll pr-1" : ""}`}
        style={
          scrollable
            ? {
                scrollbarWidth: "thin",
                scrollbarColor: "var(--light-blue) transparent",
                scrollbarGutter: "stable",
              }
            : undefined
        }
      >
        {rows.map((row) => (
          <div
            key={row.label}
            className="space-y-2 rounded-2xl p-3 border border-(--border-light) bg-[rgba(0,0,0,0.02)] hover:shadow-(--shadow-md) transition-all"
          >
            <div
              className="text-sm font-semibold text-(--text-primary) truncate pr-2"
            >
              {row.label}
            </div>
            {renderBar(
              "IN",
              row.in,
              { total: "rgba(0,169,242,0.25)", unique: "var(--light-blue)" },
              `${row.label}-in`,
            )}
            {renderBar(
              "OUT",
              row.out,
              {
                total: "rgba(224,68,32,0.25)",
                unique: "var(--primary-orange)",
              },
              `${row.label}-out`,
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
