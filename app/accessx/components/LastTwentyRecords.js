"use client";

import { useEffect, useState } from "react";
import { fetchAccessLast20 } from "./api";
import { getAuthSession } from "@livelink/lib/authStorage";

const statusClass = (status) => {
  const normalized = status?.toLowerCase() ?? "";
  if (normalized === "allowed" || normalized === "allow") {
    return "bg-[rgba(0,169,242,0.1)] text-[var(--light-blue)]";
  }
  if (normalized === "not allow" || normalized === "denied") {
    return "bg-[rgba(233,65,32,0.1)] text-[var(--accent-red)]";
  }
  return "bg-[rgba(0,0,0,0.05)] text-[color:var(--text-secondary)]";
};

const statusBgMobile = (status) => {
  const normalized = status?.toLowerCase() ?? "";
  if (normalized === "allowed" || normalized === "allow") {
    return "bg-[rgba(0,169,242,0.08)]";
  }
  if (normalized === "not allow" || normalized === "denied") {
    return "bg-[rgba(233,65,32,0.08)]";
  }
  return "bg-[color:var(--bg-primary)]";
};

const directionClass = (dir) =>
  dir?.toUpperCase() === "IN"
    ? "bg-[var(--light-blue)] text-white"
    : "bg-[var(--light-blue)]/10 text-[var(--light-blue)]";

function formatTime(unixSeconds) {
  if (!unixSeconds) return "—";
  const date = new Date(unixSeconds * 1000);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

export function LastTwentyRecords() {
  const [records, setRecords] = useState([]);
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
    async function loadRecords() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchAccessLast20({ token });
        if (!cancelled) {
          setRecords(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load records.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRecords();
    return () => {
      cancelled = true;
    };
  }, []);

  const renderTable = (
    <div className="hidden md:block">
      <div className="max-h-105 overflow-y-auto rounded-2xl border border-(--border-light)">
        <table className="min-w-full text-left text-sm text-(--text-secondary)">
          <thead className="sticky top-0 bg-[rgba(0,0,0,0.02)] backdrop-blur-sm">
            <tr className="text-xs font-(--fw-semibold) uppercase tracking-[0.08em] text-(--text-tertiary)">
              <th className="px-3 py-2">Card Id</th>
              <th className="px-3 py-2">Gate</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Time</th>
              <th className="px-3 py-2">Direction</th>
              <th className="px-3 py-2">Mode</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-3 py-4 text-center text-(--text-secondary)">
                  Loading records…
                </td>
              </tr>
            )}
            {!loading && records.length === 0 && !error && (
              <tr>
                <td colSpan={7} className="px-3 py-4 text-center text-(--text-secondary)">
                  No records found.
                </td>
              </tr>
            )}
            {!loading &&
              records.slice(0, 20).map((entry, idx) => (
                <tr key={`${entry.card_id || "card"}-${idx}`} className={`transition hover:bg-[rgba(0,0,0,0.02)] ${idx % 2 === 0 ? "bg-(--bg-secondary)" : "bg-[rgba(0,0,0,0.01)]"}`}>
                  <td className="px-3 py-3 font-(--fw-semibold) text-(--text-primary)">{entry.card_id || "—"}</td>
                  <td className="px-3 py-3">{entry.gate_name || "—"}</td>
                  <td className="px-3 py-3">{entry.category_name || "—"}</td>
                  <td className="px-3 py-3 text-(--text-secondary)">{formatTime(entry.tapped_at_unix)}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex min-w-13 items-center justify-center rounded-full px-3 py-1 text-xs font-(--fw-semibold) uppercase ${directionClass(entry.direction)}`}>
                      {entry.direction || "—"}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center justify-center rounded-full border border-(--border-light) bg-[rgba(0,0,0,0.02)] px-3 py-1 text-xs font-(--fw-semibold) text-(--text-secondary) capitalize">
                      {entry.type || "—"}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex min-w-17.5 items-center justify-center rounded-full px-3 py-1 text-xs font-(--fw-semibold) ${statusClass(entry.status)}`}>
                      {entry.status || "—"}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCards = (
    <div className="sticky top-2 space-y-2 overflow-y-auto md:hidden" style={{ maxHeight: "60vh" }}>
      {loading && (
        <div className="rounded-2xl border border-(--border-light) bg-(--bg-primary) px-3 py-3 text-sm text-(--text-secondary)">
          Loading records…
        </div>
      )}
      {!loading && records.length === 0 && !error && (
        <div className="rounded-2xl border border-(--border-light) bg-(--bg-primary) px-3 py-3 text-sm text-(--text-secondary)">
          No records found.
        </div>
      )}
      {!loading &&
        records.slice(0, 20).map((entry, idx) => (
          <div
            key={`${entry.card_id || "card"}-${idx}`}
            className={`rounded-2xl border border-(--border-light) px-4 py-3 shadow-(--shadow-sm) hover:shadow-(--shadow-md) transition ${statusBgMobile(entry.status)}`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-(--fw-semibold) text-(--text-primary) leading-tight">
                <div>{entry.card_id || "—"}{entry.gate_name ? ` • ${entry.gate_name}` : ""}</div>
              </div>
              <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-(--fw-semibold) uppercase ${directionClass(entry.direction)}`}>
                {entry.direction || "—"}
              </span>
            </div>
            <div className="mt-2 space-y-1 text-[11px] text-(--text-secondary)">
              <div className="flex items-center justify-between gap-3">
                <span className="capitalize">{entry.type || "—"} {entry.category_name || ""}</span>
                <span className="text-(--text-tertiary) whitespace-nowrap">{formatTime(entry.tapped_at_unix)}</span>
              </div>

            </div>
          </div>
        ))}
    </div>
  );

  return (
    <div className="rounded-3xl border border-(--border-light)  bg-[#FEEBDF] p-6 shadow-(--shadow-lg) transition-all hover:shadow-(--shadow-xl)">
      <h3 className="text-lg font-(family-name:--font-chillax) font-(--fw-semibold) text-(--text-primary)">Last 20 Entries</h3>

      {error && (
        <div className="mt-3 rounded-lg border border-(--accent-red) bg-[rgba(233,65,32,0.08)] px-3 py-2 text-sm text-(--accent-red)">
          {error}
        </div>
      )}

      <div className="mt-4">
        {renderTable}
        {renderCards}
      </div>
    </div>
  );
}
