"use client";

import { useEffect, useState } from "react";
import { fetchAccessDevice } from "./api";
import { getAuthSession } from "@livelink/lib/authStorage";

function formatTime(unixSeconds) {
  if (!unixSeconds) return "—";
  const date = new Date(unixSeconds * 1000);
  return date
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(",", " -");
}

function formatLabel(text) {
  if (!text) return "";

  return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
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
    <div className="rounded-lg border border-(--border-light)  bg-[#FEEBDF] p-6 shadow-(--shadow-sm) transition-all hover:shadow-(--shadow-sm)">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-lg font-(family-name:--font-chillax) font-(--fw-semibold) text-(--text-primary)">
            Devices
          </h3>
          <div className="flex items-center gap-2 text-xs font-(--fw-semibold) text-(--text-secondary)">
            <span className="text-xs uppercase tracking-[0.18em] font-(--fw-semibold) text-(--text-secondary) pt-1">
              - View-{" "}
            </span>
            <div className="flex items-center gap-1 rounded-sm bg-white px-1 ">
              <button
                type="button"
                onClick={() => setView("grid")}
                className={`rounded-full px-3 text-sm font-(--fw-semibold) transition ${view === "grid" ? "bg-(--black) text-white shadow" : "text-(--text-secondary)"}`}
              >
                Cards
              </button>
              <button
                type="button"
                onClick={() => setView("table")}
                className={`rounded-full px-3 text-sm font-(--fw-semibold) transition ${view === "table" ? "bg-(--black) text-white shadow" : "text-(--text-secondary)"}`}
              >
                Table
              </button>
            </div>
          </div>
        </div>
        {loading && (
          <span className="text-xs text-(--text-secondary)">Loading…</span>
        )}
      </div>
      {error && (
        <div className="mt-3 rounded-lg border border-(--accent-red) bg-[rgba(233,65,32,0.08)] px-3 py-2 text-sm text-(--accent-red)">
          {error}
        </div>
      )}

      {view === "grid" && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {(expanded ? devices : devices.slice(0, 12)).map((device, idx) => {
            const keyParts = [
              device.id,
              device.device_print_id,
              device.latesttime,
              idx,
            ].filter(Boolean);
            const key = keyParts.join("-");
            return (
              <div
                key={key}
                className="relative overflow-hidden rounded-lg border border-(--border-light) bg-(--bg-secondary) p-2 shadow-(--shadow-md) transition-all hover:shadow-(--shadow-sm)"
              >
                {/* <div className="absolute right-3 top-3 h-7 w-7 rounded-full border border-(--light-blue)/40 bg-(--bg-secondary) text-center text-sm font-(--fw-semibold) text-(--light-blue) flex items-center justify-center">
                  –
                </div> */}
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 space-y-0.5">
                    <p className="text-sm font-medium text-slate-800">
                      {formatLabel(device.gate_name) || "—"}
                    </p>
                    <p className="text-xs text-(--text-secondary)">
                      {formatLabel(device.category_name) || "—"}
                    </p>
                    <p className="text-xs font-(--fw-semibold) text-(--text-secondary)">
                      Type :{" "}
                      <span className="font-(--fw-semibold) uppercase">
                        {device.type || device.direction || "—"}
                      </span>
                    </p>
                    <p className="text-xs text-(--text-tertiary)">
                      {formatTime(device.latesttime)}
                    </p>
                  </div>
                  <div className="mx-1 h-10 w-px bg-(--border-light)" />
                  <div className="flex flex-col items-center justify-center min-w-14 pr-3">
                    <span className="text-lg font-(--fw-bold) text-(--light-blue)">
                      {device.unique_count ?? "—"}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-(--text-tertiary)">
                      Count
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          {!loading && !devices.length && !error && (
            <p className="text-sm text-(--text-secondary)">No devices found.</p>
          )}
          {devices.length > 12 && (
            <div className="sm:col-span-2 md:col-span-3 lg:col-span-4">
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="mt-2 w-full rounded-full border border-(--border-light) bg-(--bg-secondary) px-3 py-2 text-sm font-(--fw-semibold) text-(--text-secondary) shadow-(--shadow-sm) transition hover:bg-white"
              >
                {expanded ? "Show less" : "Show all"}
              </button>
            </div>
          )}
        </div>
      )}

      {view === "table" && (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-(--text-secondary)">
            <thead className="bg-white text-xs font-(--fw-semibold) uppercase tracking-[0.08em] text-(--text-tertiary)">
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
                  <td
                    colSpan={6}
                    className="px-3 py-3 text-center text-(--text-secondary)"
                  >
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && devices.length === 0 && !error && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-3 text-center text-(--text-secondary)"
                  >
                    No devices found.
                  </td>
                </tr>
              )}
              {!loading &&
                (expanded ? devices : devices.slice(0, 10)).map(
                  (device, idx) => {
                    const keyParts = [
                      device.id,
                      device.device_print_id,
                      device.latesttime,
                      idx,
                    ].filter(Boolean);
                    const key = keyParts.join("-");
                    return (
                      <tr
                        key={key}
                        className="border-b border-(--border-light) transition-colors"
                      >
                        <td className="px-3 py-2 font-(--fw-medium) text-(--text-primary)">
                          {device.device_print_id || "—"}
                        </td>
                        <td className="px-3 py-2">
                          {formatLabel(device.gate_name) || "—"}
                        </td>
                        <td className="px-3 py-2">
                          {formatLabel(device.category_name) || "—"}
                        </td>
                        <td className="px-3 py-2 text-(--light-blue) font-(--fw-semibold)">
                          {device.unique_count ?? "—"}
                        </td>
                        <td className="px-3 py-2 text-xs uppercase tracking-[0.16em] text-(--text-secondary)">
                          {device.direction || "—"}
                        </td>
                        <td className="px-3 py-2 text-xs text-(--text-secondary)">
                          {formatTime(device.latesttime)}
                        </td>
                      </tr>
                    );
                  },
                )}
            </tbody>
          </table>
          {devices.length > 10 && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="mt-3 w-full rounded-lg border border-(--border-light-blue) bg-(--bg-secondary) px-3 py-2 text-sm font-(--fw-semibold) text-(--text-secondary) shadow-(--shadow-sm) transition hover:bg-white"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
