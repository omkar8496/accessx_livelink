"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { fetchAccessGateCatg } from "./api";
import { getAuthSession } from "@livelink/lib/authStorage";

function formatLabel(text) {
  if (!text) return "";

  return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

const COLORS = [
  "#E04420",
  "#00A9F2",
  "#341CD6",
  "#F7825C",
  "#4FC3F7",
  "#D5B7FF",
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
        if (!cancelled)
          setError(err.message || "Unable to load category split data.");
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

  const formatGateName = (name) =>
    name.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

  const gateOptions = useMemo(() => {
    const unique = Array.from(
      new Set((data || []).map((item) => item.gate_name || "Unknown")),
    );
    return ["ALL", ...unique];
  }, [data]);

  const filtered = useMemo(() => {
    let items = data || [];
    if (selectedGate && selectedGate !== "ALL") {
      items = items.filter(
        (item) => (item.gate_name || "Unknown") === selectedGate,
      );
    }
    items = items.filter((item) => {
      const dir = (item.direction || "").toUpperCase();
      if (dir === "IN") return direction === "IN";
      return direction === "OUT";
    });
    if (typeFilter !== "ALL") {
      items = items.filter(
        (item) => (item.type || "").toLowerCase() === typeFilter.toLowerCase(),
      );
    }
    return items;
  }, [data, selectedGate, direction, typeFilter]);

  const { segments, totalCount, totalUnique } = useMemo(() => {
    const agg = filtered.reduce((acc, item) => {
      const key = item.category_name || "Unknown";
      const prev = acc.get(key) || { count: 0, unique: 0 };
      acc.set(key, {
        count: prev.count + (Number(item.count) || 0),
        unique: prev.unique + (Number(item.unique_count) || 0),
      });
      return acc;
    }, new Map());

    const list = Array.from(agg.entries())
      .map(([label, values], idx) => ({
        label,
        count: values.count,
        unique: values.unique,
        color: COLORS[idx % COLORS.length],
      }))
      .sort((a, b) => b.unique - a.unique);

    const totals = list.reduce(
      (acc, item) => {
        acc.total += item.count;
        acc.unique += item.unique;
        return acc;
      },
      { total: 0, unique: 0 },
    );

    return {
      segments: list,
      totalCount: totals.total,
      totalUnique: totals.unique,
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
            items: [...acc.items, { ...seg, dashArray, offset }],
          };
        },
        { cumulative: 0, items: [] },
      ).items,
    [circumference, segments, totalUnique],
  );

  const chartData = segments.map((seg) => ({
    name: seg.label,
    value: seg.unique,
    color: seg.color,
  }));

  return (
    <div className="rounded-lg border border-slate-200 bg-[#FEEBDF] p-5 shadow-sm">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedGate}
            onChange={(e) => setSelectedGate(e.target.value)}
            className="min-w-30 rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none"
          >
            {gateOptions.map((gate) => (
              <option key={gate} value={gate}>
                {gate === "ALL" ? "All Gates" : formatGateName(gate)}
              </option>
            ))}
          </select>

          <div className="flex items-center rounded-md border border-slate-300 bg-white p-1 shadow-sm">
            {["IN", "OUT"].map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => setDirection(dir)}
                className={`min-w-13 px-3 py-1 text-xs font-medium rounded-full transition focus:outline-none ${
                  direction === dir
                    ? "bg-(--black) text-white"
                    : "text-(--black) hover:bg-(--egg-white)"
                }`}
              >
                {dir}
              </button>
            ))}
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="min-w-22.5 rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none"
          >
            <option value="ALL">All</option>
            <option value="nfc">nfc</option>
            <option value="qr">qr</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-sm border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          404 (Category Split data)
        </div>
      )}

      {/* Loading */}
      {loading && !error && (
        <div className="mt-6 h-56 animate-pulse rounded-md bg-slate-100" />
      )}

      {/* Empty */}
      {!loading && !error && segments.length === 0 && (
        <p className="mt-4 text-sm text-slate-800">No category data.</p>
      )}

      {/* Graph */}
      {!loading && !error && segments.length > 0 && (
        <div className="mt-5">
          <div className="relative flex flex-col items-center gap-4 rounded-md border border-[#F4D6C8] bg-white px-4 py-4">
            <div className="flex w-full items-center justify-between">
              <div className="text-center">
                <p className="text-sm font-medium text-blue-500">UNIQUE</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {totalUnique}
                </p>
              </div>

              {/* Pie Chart */}
              <div className="h-56 w-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="text-center">
                <p className="text-sm font-medium text-red-500">TOTAL</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {totalCount}
                </p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 max-h-48 overflow-y-auto space-y-2 pr-1">
            {segments.map((seg, idx) => (
              <div
                key={seg.label + idx}
                className="flex items-center justify-between rounded-sm border border-slate-200 bg-white px-3 py-2 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="font-normal text-slate-700">
                    {formatLabel(seg.label) || "Unknown"}
                  </span>
                </div>
                <div className="text-right text-slate-800">
                  <div className="font-medium">{seg.unique}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
