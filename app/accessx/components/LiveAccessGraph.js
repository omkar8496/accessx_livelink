"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchAccessHourwise } from "./api";
import { getAuthSession } from "@livelink/lib/authStorage";

function formatHourOnly(hourStart) {
  if (!hourStart) return "-";
  const date = new Date(hourStart.replace(" ", "T"));
  return String(date.getHours());
}

function getRoundedMax(maxValue) {
  if (!maxValue || Number.isNaN(maxValue)) return 100;
  const str = String(Math.floor(maxValue));
  const magnitude = 10 ** (str.length - 1);
  const fiveMag = 5 * magnitude;
  if (maxValue <= fiveMag) return fiveMag;
  return 10 * magnitude;
}

function buildTicks(maxValue) {
  const top = getRoundedMax(Math.max(maxValue, 1));
  const step = top / 5;
  return [top, top - step, top - 2 * step, top - 3 * step, top - 4 * step, 0];
}

function toHourStart(item) {
  if (item?.hour_start) return item.hour_start;
  if (item?.tapped_at_unix) {
    const date = new Date((item.tapped_at_unix || 0) * 1000);
    date.setMinutes(0, 0, 0);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:00:00`;
  }
  return null;
}

export function LiveAccessGraph() {
  const [bars, setBars] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const session = getAuthSession();
    const token = session?.token;
    if (!token) {
      queueMicrotask(() => setError("Missing token. Please log in again."));
      return;
    }

    let cancelled = false;
    async function loadHourwise() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchAccessHourwise({ token });
        if (!cancelled) {
          const normalized = Array.isArray(data) ? data : [];
          const buckets = normalized.reduce((acc, item) => {
            const hourStart = toHourStart(item);
            if (!hourStart) return acc;
            const key = hourStart;
            const prev = acc.get(key) || 0;
            const val = Number(item.count) || Number(item.unique_count) || 0;
            acc.set(key, prev + (val || 1));
            return acc;
          }, new Map());

          const aggregated = Array.from(buckets.entries())
            .map(([hour_start, count]) => ({ hour_start, count }))
            .sort((a, b) => new Date(a.hour_start) - new Date(b.hour_start));

          setBars(aggregated);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load access graph.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadHourwise();
    return () => {
      cancelled = true;
    };
  }, []);

  const maxValue = useMemo(() => {
    if (!bars.length) return 100;
    return Math.max(...bars.map((b) => Number(b.count) || 0), 1);
  }, [bars]);

  const yTicks = useMemo(() => buildTicks(maxValue), [maxValue]);
  const yLabels = yTicks;
  const topValue = yTicks[0] || 100;
  const barAreaHeight = 260;

  return (
    <div className="rounded-lg bg-(--light-blue) p-3 md:p-4 text-white shadow-(--shadow-lg) ring-1 ring-black/10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 md:gap-2 text-xs md:text-sm font-(--fw-semibold) tracking-[0.15em] text-white/90">
        <span>Current</span>
        <span className="tracking-normal text-white/80 text-xs">Hourwise</span>
      </div>

      {error && (
        <div className="mt-2 md:mt-3 rounded-lg border border-white/30 bg-white/10 px-2 md:px-3 py-1.5 md:py-2 text-xs text-white">
          {error}
        </div>
      )}

      {!error && (
        <div className="mt-3 md:mt-4">
          <div className="flex w-full overflow-x-auto md:overflow-visible">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between text-[10px] md:text-xs font-(--fw-semibold) text-white/80 min-w-6 md:min-w-10 items-end pr-0.5 md:pr-1.5 select-none shrink-0 h-30 md:h-40">
              {yLabels.map((tick) => (
                <span key={tick} className="leading-none">
                  {tick}
                </span>
              ))}
            </div>
            {/* Bar area */}
            <div className="flex-1 min-w-0">
              <div className="overflow-x-auto w-full">
                <div className="flex h-30 md:h-40 items-end gap-px md:gap-1 min-w-70 md:min-w-0 px-0.5 md:px-0">
                  {loading && (
                    <div className="text-xs text-white/80">Loading…</div>
                  )}
                  {!loading && bars.length === 0 && (
                    <div className="text-xs text-white/80">No data</div>
                  )}
                  {!loading &&
                    bars.map((bar) => {
                      const val = Number(bar.count) || 1;
                      const heightPx = Math.max(
                        (val / topValue) *
                          (window.innerWidth < 768 ? 80 : barAreaHeight),
                        6,
                      );
                      return (
                        <div
                          key={bar.hour_start}
                          className="flex min-w-1 md:min-w-2 flex-1 flex-col items-center justify-end"
                        >
                          <div
                            className="w-1 md:w-2 rounded-full border border-white/70 bg-linear-to-b from-(--primary-orange) via-(--purple) to-white shadow-[0_8px_20px_rgba(0,0,0,0.15)]"
                            style={{ height: `${heightPx}px` }}
                          />
                        </div>
                      );
                    })}
                </div>
                {/* X-axis labels and bar values */}
                <div className="flex mt-0.5 md:mt-1.5 gap-px md:gap-1 min-w-70 md:min-w-0 px-0.5 md:px-0">
                  {!loading &&
                    bars.map((bar) => {
                      const val = Number(bar.count) || 1;
                      return (
                        <div
                          key={bar.hour_start}
                          className="flex min-w-1 md:min-w-2 flex-1 flex-col items-center justify-start"
                        >
                          <span className="text-[8px] md:text-xs font-(--fw-semibold) text-white/90 whitespace-nowrap leading-tight">
                            {formatHourOnly(bar.hour_start)}
                          </span>
                          <span className="text-[8px] md:text-xs font-(--fw-semibold) text-white/80 leading-none text-center">
                            {val}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
