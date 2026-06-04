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
    <div className="rounded-3xl border border-[color:var(--border-light)] bg-[color:var(--bg-secondary)] p-6 shadow-[var(--shadow-lg)] transition-all hover:shadow-[var(--shadow-xl)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-lg font-[family-name:var(--font-chillax)] font-[var(--fw-semibold)] text-[color:var(--text-primary)]">Devices</h3>
          <div className="flex items-center gap-2 text-xs font-[var(--fw-semibold)] text-[color:var(--text-secondary)]">
            <span className="text-[11px] uppercase tracking-[0.18em] font-[var(--fw-semibold)] text-[color:var(--text-secondary)] pt-1">- View- </span>
            <div className="flex items-center gap-[4px] rounded-full bg-[rgba(0,169,242,0.08)] px-1 ">
              <button
                type="button"
                onClick={() => setView("grid")}
                className={`rounded-full px-3 text-sm font-[var(--fw-semibold)] transition ${view === "grid" ? "bg-[var(--light-blue)] text-white shadow" : "text-[color:var(--text-secondary)]"}`}
              >
                Cards
              </button>
              <button
                type="button"
                onClick={() => setView("table")}
                className={`rounded-full px-3 text-sm font-[var(--fw-semibold)] transition ${view === "table" ? "bg-[var(--light-blue)] text-white shadow" : "text-[color:var(--text-secondary)]"}`}
              >
                Table
              </button>
            </div>
          </div>
        </div>
        {loading && <span className="text-xs text-[color:var(--text-secondary)]">Loading…</span>}
      </div>
      {error && (
        <div className="mt-3 rounded-[color:var(--radius-lg)] border border-[color:var(--accent-red)] bg-[rgba(233,65,32,0.08)] px-3 py-2 text-sm text-[color:var(--accent-red)]">
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
                className="relative overflow-hidden rounded-2xl border border-[color:var(--border-light)] bg-[color:var(--bg-secondary)] p-4 shadow-[var(--shadow-md)] transition-all hover:shadow-[var(--shadow-lg)]"
              >
                <div className="absolute right-3 top-3 h-7 w-7 rounded-full border border-[var(--light-blue)]/40 bg-[color:var(--bg-secondary)] text-center text-sm font-[var(--fw-semibold)] text-[color:var(--light-blue)] flex items-center justify-center">
                  –
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-[var(--fw-semibold)] text-[color:var(--text-primary)]">
                      {device.gate_name ? `Gate ${device.gate_name}` : "Gate"}{" "}
                      <span className="font-[var(--fw-bold)]">- {device.device_print_id || "—"}</span>
                    </p>
                    <p className="text-[12px] text-[color:var(--text-secondary)]">
                      {device.category_name || "—"}
                    </p>
                    <p className="text-[12px] font-[var(--fw-semibold)] text-[color:var(--text-secondary)]">
                      type : <span className="font-[var(--fw-semibold)] uppercase">{device.type || device.direction || "—"}</span>
                    </p>
                    <p className="text-[11px] text-[color:var(--text-tertiary)]">{formatTime(device.latesttime)}</p>
                  </div>
                  <div className="mx-2 h-14 w-px bg-[color:var(--border-light)]" />
                  <div className="flex flex-col items-center justify-center min-w-[70px] pr-8">
                    <span className="text-2xl font-[var(--fw-bold)] text-[color:var(--light-blue)]">
                      {device.unique_count ?? "—"}
                    </span>
                    <span className="text-xs uppercase tracking-wider text-[color:var(--text-tertiary)]">Count</span>
                  </div>
                </div>
              </div>
            );
          })}
          {!loading && !devices.length && !error && (
            <p className="text-sm text-[color:var(--text-secondary)]">No devices found.</p>
          )}
          {devices.length > 12 && (
            <div className="sm:col-span-2 md:col-span-3 lg:col-span-4">
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="mt-2 w-full rounded-full border border-[color:var(--border-light)] bg-[color:var(--bg-secondary)] px-3 py-2 text-sm font-[var(--fw-semibold)] text-[color:var(--text-secondary)] shadow-[var(--shadow-sm)] transition hover:bg-[rgba(0,0,0,0.02)]"
              >
                {expanded ? "Show less" : "Show all"}
              </button>
            </div>
          )}
        </div>
      )}

      {view === "table" && (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-[color:var(--text-secondary)]">
            <thead className="bg-[rgba(0,0,0,0.02)] text-xs font-[var(--fw-semibold)] uppercase tracking-[0.08em] text-[color:var(--text-tertiary)]">
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
                  <td colSpan={6} className="px-3 py-3 text-center text-[color:var(--text-secondary)]">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && devices.length === 0 && !error && (
                <tr>
                  <td colSpan={6} className="px-3 py-3 text-center text-[color:var(--text-secondary)]">
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
                    <tr key={key} className="border-b border-[color:var(--border-light)] hover:bg-[rgba(0,0,0,0.02)] transition-colors">
                      <td className="px-3 py-2 font-[var(--fw-semibold)] text-[color:var(--text-primary)]">
                        {device.device_print_id || "—"}
                      </td>
                      <td className="px-3 py-2">{device.gate_name || "—"}</td>
                      <td className="px-3 py-2">{device.category_name || "—"}</td>
                      <td className="px-3 py-2 text-[color:var(--light-blue)] font-[var(--fw-semibold)]">
                        {device.unique_count ?? "—"}
                      </td>
                      <td className="px-3 py-2 text-xs uppercase tracking-[0.16em] text-[color:var(--text-secondary)]">
                        {device.direction || "—"}
                      </td>
                      <td className="px-3 py-2 text-xs text-[color:var(--text-secondary)]">
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
              className="mt-3 w-full rounded-[color:var(--radius-lg)] border border-[color:var(--border-light)] bg-[color:var(--bg-secondary)] px-3 py-2 text-sm font-[var(--fw-semibold)] text-[color:var(--text-secondary)] shadow-[var(--shadow-sm)] transition hover:bg-[rgba(0,0,0,0.02)]"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
