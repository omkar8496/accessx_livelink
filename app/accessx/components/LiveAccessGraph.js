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
    <div className="rounded-[24px] bg-[#2f9aa8] p-5 text-white shadow-[0_18px_40px_rgba(0,0,0,0.12)] md:p-6">
      <div className="flex items-center justify-between text-sm font-semibold tracking-[0.2em] text-white/90">
        <span>Current</span>
        <span className="tracking-normal text-white/80">Hourwise</span>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-sm text-white">
          {error}
        </div>
      )}

      {!error && (
        <div className="mt-6">
          <div className="flex w-full">
            {/* Y-axis labels */}
            <div className="flex h-[140px] md:h-[220px] flex-col justify-between text-xs md:text-sm font-semibold text-white/80 min-w-8 md:min-w-11 items-end pr-1 md:pr-2 select-none">
              {yLabels.map((tick) => (
                <span key={tick}>{tick}</span>
              ))}
            </div>
            {/* Bar area */}
            <div className="flex-1 flex-col w-0 min-w-0">
              <div className="overflow-x-auto w-full max-w-full">
                <div className="flex h-[140px] md:h-[220px] items-end gap-0.5 md:gap-2 min-w-[340px] md:min-w-0">
                  {loading && (
                    <div className="text-xs md:text-sm text-white/80">Loading…</div>
                  )}
                  {!loading && bars.length === 0 && (
                    <div className="text-xs md:text-sm text-white/80">No data</div>
                  )}
                  {!loading &&
                    bars.map((bar) => {
                      const val = Number(bar.count) || 1;
                      const heightPx = Math.max((val / topValue) * (window.innerWidth < 768 ? 80 : barAreaHeight), 10);
                      return (
                        <div key={bar.hour_start} className="flex min-w-4 md:min-w-6 flex-1 flex-col items-center justify-end">
                          <div
                            className="w-2 md:w-4 rounded-full border border-white/70 bg-gradient-to-b from-[#ffedd5] via-[#fef3c7] to-white shadow-[0_10px_25px_rgba(0,0,0,0.18)]"
                            style={{ height: `${heightPx}px` }}
                          />
                        </div>
                      );
                    })}
                </div>
                {/* X-axis labels and bar values below bars */}
                <div className="flex mt-1 md:mt-2 gap-0.5 md:gap-2 min-w-[340px] md:min-w-0">
                  {!loading && bars.map((bar) => {
                    const val = Number(bar.count) || 1;
                    return (
                      <div key={bar.hour_start} className="flex min-w-4 md:min-w-6 flex-1 flex-col items-center justify-start">
                        <span className="text-[10px] md:text-xs font-semibold text-white/90 whitespace-nowrap">{formatHourOnly(bar.hour_start)}</span>
                        <span className="text-[10px] md:text-xs font-semibold text-white/80">{val}</span>
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
