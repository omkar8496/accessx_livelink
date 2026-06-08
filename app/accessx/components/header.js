"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

function readEventValue(event, keys, fallback = "") {
  for (const key of keys) {
    const value = event?.[key];
    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value);
    }
  }
  return fallback;
}

function formatHeaderTime(date) {
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

export default function EventHeader({ event }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const title = readEventValue(event, ["name", "eventName", "event_name", "title"], "Event Name");
  const venue = readEventValue(event, ["venue", "venueName", "venue_name", "location"], "Venue");
  const city = readEventValue(event, ["city", "eventCity"], "City");
  const country = readEventValue(event, ["country", "eventCountry"], "Country");
  const location = useMemo(
    () => [venue, [city, country].filter(Boolean).join(", ")].filter(Boolean).join("  •  "),
    [city, country, venue]
  );

  return (
    <header
      role="banner"
      className="mb-6 rounded-[var(--radius-xl)] border-l-4 border-l-[color:var(--primary-orange)] border border-[color:var(--border-light)] bg-[color:var(--bg-secondary)] px-5 py-3 md:px-6 md:py-4 shadow-[var(--shadow-lg)] transition-shadow duration-200 shadow-[var(--shadow-lg)] md:px-8"
    >
      <div className="grid gap-4 md:grid-cols-[140px_1fr_auto] md:items-center">
        <div className="flex items-center">
          <Image
            src="/AtomX_Logo.svg"
            alt="AtomX"
            width={144}
            height={64}
            priority
            className="h-14 w-32 object-contain md:h-16 md:w-36"
          />
        </div>

        <div className="min-w-0">
          <h1 className="truncate text-[var(--text-primary)] font-[family-name:var(--font-chillax)] font-[var(--fw-semibold)] text-xl md:text-[24px] leading-tight">
            {title}
          </h1>
          <div className="mt-1 flex min-w-0 items-center gap-2 text-sm font-[var(--fw-medium)] text-[color:var(--text-secondary)] md:text-base">
            <span className="relative h-3.5 w-3.5 shrink-0 rounded-full bg-[color:var(--light-blue)] shadow-[0_0_0_2px_rgba(0,169,242,0.14)]">
              <span className="absolute left-1/2 top-full h-2 w-0.5 -translate-x-1/2 rounded-full bg-[color:var(--light-blue)]" />
            </span>
            <p className="truncate">{location}</p>
          </div>
        </div>
        <time
          aria-live="polite"
          aria-label={`Current time: ${formatHeaderTime(now)}`}
          className="self-start text-right text-sm font-[var(--fw-bold)] leading-none text-[color:var(--text-tertiary)] md:text-base tabular-nums"
        >
          {formatHeaderTime(now)}
        </time>
      </div>
    </header>
  );
}
