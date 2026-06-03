"use client";

import { useEffect, useState } from "react";
import { fetchAccessLast20 } from "./api";
import { getAuthSession } from "@livelink/lib/authStorage";

const statusClass = (status) => {
  const normalized = status?.toLowerCase() ?? "";
  if (normalized === "allowed" || normalized === "allow") {
    return "bg-[#d8f3dc] text-[#1b7f3b]";
  }
  if (normalized === "not allow" || normalized === "denied") {
    return "bg-[#fbcfd2] text-[#d83a3a]";
  }
  return "bg-slate-100 text-slate-700";
};

const statusBgMobile = (status) => {
  const normalized = status?.toLowerCase() ?? "";
  if (normalized === "allowed" || normalized === "allow") {
    return "bg-[#eaf7ec]";
  }
  if (normalized === "not allow" || normalized === "denied") {
    return "bg-[#fce7ea]";
  }
  return "bg-slate-50";
};

const directionClass = (dir) =>
  dir?.toUpperCase() === "IN"
    ? "bg-[#0b9bb2] text-white"
    : "bg-[#0b9bb2]/10 text-[#0b9bb2]";

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
      <div className="max-h-[420px] overflow-y-auto">
        <table className="min-w-full text-left text-sm text-slate-700">
          <thead className="sticky top-0 bg-white">
            <tr className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
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
                <td colSpan={7} className="px-3 py-4 text-center text-slate-600">
                  Loading records…
                </td>
              </tr>
            )}
            {!loading && records.length === 0 && !error && (
              <tr>
                <td colSpan={7} className="px-3 py-4 text-center text-slate-600">
                  No records found.
                </td>
              </tr>
            )}
            {!loading &&
              records.slice(0, 20).map((entry, idx) => (
                <tr key={`${entry.card_id || "card"}-${idx}`} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-3 py-3 font-semibold text-slate-900">{entry.card_id || "—"}</td>
                  <td className="px-3 py-3">{entry.gate_name || "—"}</td>
                  <td className="px-3 py-3">{entry.category_name || "—"}</td>
                  <td className="px-3 py-3 text-slate-600">{formatTime(entry.tapped_at_unix)}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex min-w-[52px] items-center justify-center rounded-full px-3 py-1 text-xs font-semibold uppercase ${directionClass(entry.direction)}`}>
                      {entry.direction || "—"}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 capitalize">
                      {entry.type || "—"}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex min-w-[70px] items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${statusClass(entry.status)}`}>
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
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600">
          Loading records…
        </div>
      )}
      {!loading && records.length === 0 && !error && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600">
          No records found.
        </div>
      )}
      {!loading &&
        records.slice(0, 20).map((entry, idx) => (
          <div
            key={`${entry.card_id || "card"}-${idx}`}
            className={`rounded-lg border border-slate-200 px-3 py-2 shadow-sm ${statusBgMobile(entry.status)}`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-semibold text-slate-900 leading-tight">
                <div>{entry.card_id || "—"}{entry.gate_name ? ` • ${entry.gate_name}` : ""}</div>
              </div>
              <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${directionClass(entry.direction)}`}>
                {entry.direction || "—"}
              </span>
            </div>
            <div className="mt-2 space-y-1 text-[11px] text-slate-700">
              <div className="flex items-center justify-between gap-3">
                <span className="capitalize">{entry.type || "—"} {entry.category_name || ""}</span>
                <span className="text-slate-600 whitespace-nowrap">{formatTime(entry.tapped_at_unix)}</span>
              </div>
              
            </div>
          </div>
        ))}
    </div>
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">Last 20 Entries</h3>

      {error && (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
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
