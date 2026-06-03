"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { fetchAccessGateCatg } from "./api";
import { getAuthSession } from "@livelink/lib/authStorage";

const COLORS = [
  "#f97316",
  "#0ea5e9",
  "#ec4899",
  "#22c55e",
  "#a855f7",
  "#06b6d4",
  "#f59e0b",
  "#ef4444"
];

export function HorizontalGraph() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedGate, setSelectedGate] = useState("ALL");
  const [direction, setDirection] = useState("IN"); // IN | OUT
  const [typeFilter, setTypeFilter] = useState("ALL"); // ALL | nfc | qr
  const fetchedRef = useRef(false);

  useEffect(() => {
    const session = getAuthSession();
    const token = session?.token;
    if (!token) {
      queueMicrotask(() => setError("Missing token. Please log in again."));
      return;
    }
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const resp = await fetchAccessGateCatg({ token });
        if (!cancelled) {
          setData(Array.isArray(resp) ? resp : []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Unable to load category split data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
      fetchedRef.current = false;
    };
  }, []);

  const gateOptions = useMemo(() => {
    const unique = Array.from(new Set((data || []).map((item) => item.gate_name || "Unknown")));
    return ["ALL", ...unique];
  }, [data]);

  const filtered = useMemo(() => {
    let items = data || [];
    if (selectedGate && selectedGate !== "ALL") {
      items = items.filter((item) => (item.gate_name || "Unknown") === selectedGate);
    }
    items = items.filter((item) => {
      const dir = (item.direction || "").toUpperCase();
      if (dir === "IN") return direction === "IN";
      return direction === "OUT";
    });
    if (typeFilter !== "ALL") {
      items = items.filter((item) => (item.type || "").toLowerCase() === typeFilter.toLowerCase());
    }
    return items;
  }, [data, selectedGate, direction, typeFilter]);

  const { segments, totalCount, totalUnique } = useMemo(() => {
    const agg = filtered.reduce((acc, item) => {
      const key = item.category_name || "Unknown";
      const prev = acc.get(key) || { count: 0, unique: 0 };
      acc.set(key, {
        count: prev.count + (Number(item.count) || 0),
        unique: prev.unique + (Number(item.unique_count) || 0)
      });
      return acc;
    }, new Map());

    const list = Array.from(agg.entries())
      .map(([label, values], idx) => ({
        label,
        count: values.count,
        unique: values.unique,
        color: COLORS[idx % COLORS.length]
      }))
      .sort((a, b) => b.unique - a.unique);

    const totals = list.reduce(
      (acc, item) => {
        acc.total += item.count;
        acc.unique += item.unique;
        return acc;
      },
      { total: 0, unique: 0 }
    );

    return {
      segments: list,
      totalCount: totals.total,
      totalUnique: totals.unique
    };
  }, [filtered]);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  const arcs = useMemo(
    () =>
      segments.reduce(
        (acc, seg) => {
          const fraction = totalUnique > 0 ? seg.unique / totalUnique : 0;
          const arcLength = fraction * circumference;
          const dashArray = `${arcLength} ${circumference - arcLength}`;
          const offset = -acc.cumulative * circumference;
          return {
            cumulative: acc.cumulative + fraction,
            items: [...acc.items, { ...seg, dashArray, offset }]
          };
        },
        { cumulative: 0, items: [] }
      ).items,
    [circumference, segments, totalUnique]
  );

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg border border-white/40 backdrop-blur-sm transition-all hover:shadow-xl">
     <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedGate}
            onChange={(e) => setSelectedGate(e.target.value)}
            className="min-w-[120px] rounded-xl border border- [#EBEBEB] bg-white px-4 py-2 text-sm font-medium shadow-sm focus:outline-none"
          >
            {gateOptions.map((gate) => (
              <option key={gate} value={gate}>
                {gate === "ALL" ? "All Gates" : gate}
              </option>
            ))}
          </select>

          <div className="flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm">
            {["IN", "OUT"].map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => setDirection(dir)}
                className={`min-w-[48px] px-3 py-1 text-xs font-semibold rounded-full transition ${
                  direction === dir
                    ? "bg-[var(--light-blue)] text-white shadow"
                    : "text-slate-700"
                }`}
              >
                {dir}
              </button>
            ))}
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="min-w-[90px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm"
          >
            <option value="ALL">All</option>
            <option value="nfc">nfc</option>
            <option value="qr">qr</option>
          </select>
        </div>
        <div className="flex-1" />
      </div>

      {error && (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          404 (Category Split data)
        </div>
      )}

      {loading && !error && (
        <div className="mt-4 h-[220px] animate-pulse rounded-2xl bg-slate-100" />
      )}

      {!loading && !error && segments.length === 0 && (
        <p className="mt-5 text-sm text-slate-600">No category data.</p>
      )}

      {!loading && !error && segments.length > 0 && (
        <div className="mt-3">
          <div className="relative flex flex-col items-center gap-3 rounded-2xl bg-gradient-to-br from-white to-[#f8f8f8] shadow-inner px-3 py-3">
            <div className="flex w-full items-center justify-between px-3">
              <div className="text-center">
                <p className="text-base font-bold text-[var(--light-blue)]">Unique</p>
                <p className="text-xl font-bold text-slate-900">{totalUnique}</p>
              </div>
              <svg
                width="180"
                height="180"
                viewBox="0 0 180 180"
                className="drop-shadow-sm"
              >
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="20"
                />
                {arcs.map((arc, idx) => (
                  <circle
                    key={arc.label + idx}
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="none"
                    stroke={arc.color}
                    strokeWidth="20"
                    strokeDasharray={arc.dashArray}
                    strokeDashoffset={arc.offset}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                ))}
              </svg>
              <div className="text-center">
                <p className="text-base font-bold text-[var(--primary-orange)]">Total</p>
                <p className="text-xl font-bold text-slate-900">{totalCount}</p>
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {arcs.map((arc, idx) => (
              <div
                key={arc.label + idx}
                className="flex items-center justify-between rounded-x1 bg-[#fafafa] border border-[#f0f0f0] hover:shadow-sm px-4 py-2 transition"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: arc.color }}
                  />
                  <span className="font-semibold text-slate-800">{arc.label || "Unknown"}</span>
                </div>
              <div className="text-right text-slate-700">
                  <div className="font-semibold">{arc.unique}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
