"use client";

import { useEffect, useState } from "react";
import { fetchAccessDevice } from "./api";
import { getAuthSession } from "@livelink/lib/authStorage";

function formatTime(unixSeconds) {
  if (!unixSeconds) return "—";
  const date = new Date(unixSeconds * 1000);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).replace(",", " -");
}

export function Device_Data() {
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("grid"); // grid | table
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const session = getAuthSession();
    const token = session?.token;
    if (!token) {
      queueMicrotask(() => setError("Missing token. Please log in again."));
      return;
    }

    let cancelled = false;
    async function loadDevices() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchAccessDevice({ token });
        if (!cancelled) {
          setDevices(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Unable to load devices.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDevices();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-3xl border border-[#F2F2F2] bg-white p-6 shadow-lg transition-all hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-lg font-[family-name:var(--font-chillax)] font-semibold text-slate-900">Devices</h3>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-slate-700 pt-1">- View- </span>
            <div className="flex items-center gap-[4px] rounded-full bg-slate-100 px-1 ">
              <button
                type="button"
                onClick={() => setView("grid")}
                className={`rounded-full px-3 text-sm font-semibold transition ${view === "grid" ? "bg-[var(--light-blue)] text-white shadow" : "text-slate-600"}`}
              >
                Cards
              </button>
              <button
                type="button"
                onClick={() => setView("table")}
                className={`rounded-full px-3 text-sm font-semibold transition ${view === "table" ? "bg-[var(--light-blue)] text-white shadow" : "text-slate-600"}`}
              >
                Table
              </button>
            </div>
          </div>
        </div>
        {loading && <span className="text-xs text-slate-500">Loading…</span>}
      </div>
      {error && (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {view === "grid" && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {(expanded ? devices : devices.slice(0, 12)).map((device, idx) => {
            const keyParts = [
              device.id,
              device.device_print_id,
              device.latesttime,
              idx
            ].filter(Boolean);
            const key = keyParts.join("-");
            return (
              <div
                key={key}
                className="relative overflow-hidden rounded-2xl border border-[#F2F2F2] bg-white p-4 shadow-md transition-all hover:shadow-lg"
              >
                <div className="absolute right-3 top-3 h-7 w-7 rounded-full border border-[var(--light-blue)]/40 bg-white text-center text-sm font-semibold text-[var(--light-blue)] flex items-center justify-center">
                  –
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-semibold text-slate-900">
                      {device.gate_name ? `Gate ${device.gate_name}` : "Gate"}{" "}
                      <span className="font-bold">- {device.device_print_id || "—"}</span>
                    </p>
                    <p className="text-[12px] text-slate-800">
                      {device.category_name || "—"}
                    </p>
                    <p className="text-[12px] font-semibold text-slate-800">
                      type : <span className="font-semibold uppercase">{device.type || device.direction || "—"}</span>
                    </p>
                    <p className="text-[11px] text-slate-500">{formatTime(device.latesttime)}</p>
                  </div>
                  <div className="mx-2 h-14 w-px bg-slate-200" />
                  <div className="flex flex-col items-center justify-center min-w-[70px] pr-8">
                    <span className="text-2xl font-bold text-[var(--light-blue)]">
                      {device.unique_count ?? "—"}
                    </span>
                    <span className="text-xs uppercase tracking-wider text-slate-500">Count</span>
                  </div>
                </div>
              </div>
            );
          })}
          {!loading && !devices.length && !error && (
            <p className="text-sm text-slate-600">No devices found.</p>
          )}
          {devices.length > 12 && (
            <div className="sm:col-span-2 md:col-span-3 lg:col-span-4">
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="mt-2 w-full rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                {expanded ? "Show less" : "Show all"}
              </button>
            </div>
          )}
        </div>
      )}

      {view === "table" && (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="bg-[#fafafa] text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
              <tr>
                <th className="px-3 py-2">Device</th>
                <th className="px-3 py-2">Gate</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Unique</th>
                <th className="px-3 py-2">Direction</th>
                <th className="px-3 py-2">Latest</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-3 py-3 text-center text-slate-600">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && devices.length === 0 && !error && (
                <tr>
                  <td colSpan={6} className="px-3 py-3 text-center text-slate-600">
                    No devices found.
                  </td>
                </tr>
              )}
              {!loading &&
                (expanded ? devices : devices.slice(0, 10)).map((device, idx) => {
                  const keyParts = [
                    device.id,
                    device.device_print_id,
                    device.latesttime,
                    idx
                  ].filter(Boolean);
                  const key = keyParts.join("-");
                  return (
                    <tr key={key} className="border-b border-slate-100 hover:bg-[#fafafa] transition-colors">
                      <td className="px-3 py-2 font-semibold text-slate-900">
                        {device.device_print_id || "—"}
                      </td>
                      <td className="px-3 py-2">{device.gate_name || "—"}</td>
                      <td className="px-3 py-2">{device.category_name || "—"}</td>
                      <td className="px-3 py-2 text-[var(--light-blue)] font-semibold">
                        {device.unique_count ?? "—"}
                      </td>
                      <td className="px-3 py-2 text-xs uppercase tracking-[0.16em] text-slate-600">
                        {device.direction || "—"}
                      </td>
                      <td className="px-3 py-2 text-xs text-slate-600">
                        {formatTime(device.latesttime)}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {devices.length > 10 && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="mt-3 w-full rounded-xl border border-[#ECECEC] bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
