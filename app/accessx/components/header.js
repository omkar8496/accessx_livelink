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
    () => [venue, [city, country].filter(Boolean).join(", ")].filter(Boolean).join(" • "),
    [city, country, venue]
  );

  return (
    <header
      role="banner"
      className="mb-6 rounded-2xl border border-[color:var(--border-light)] 
                 bg-gradient-to-r from-[color:var(--electric-blue)] to-[color:var(--primary-orange)] 
                 px-6 py-4 shadow-[var(--shadow-lg)] transition-shadow duration-200 hover:shadow-[var(--shadow-xl)]"
    >
      <div className="grid gap-4 md:grid-cols-[160px_1fr_auto] md:items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/AtomX_Logo.svg"
            alt="AtomX"
            width={144}
            height={64}
            priority
            className="h-16 w-36 object-contain md:h-20 md:w-44 drop-shadow-md"
          />
        </div>

        {/* Title + Location */}
        <div className="min-w-0">
          <h1 className="truncate font-[family-name:var(--font-chillax)] font-bold 
                         text-white text-2xl md:text-[28px] leading-tight drop-shadow-sm">
            {title}
          </h1>
          <div className="mt-2 flex items-center gap-2 text-sm md:text-base">
            <span className="px-3 py-1 rounded-full bg-[color:var(--light-blue)] 
                             text-white font-[var(--fw-medium)] shadow-sm">
              {location}
            </span>
          </div>
        </div>

        {/* Time */}
        <time
          aria-live="polite"
          aria-label={`Current time: ${formatHeaderTime(now)}`}
          className="self-start text-right text-sm md:text-base font-[var(--fw-semibold)] 
                     text-white drop-shadow-sm tabular-nums"
        >
          {formatHeaderTime(now)}
        </time>
      </div>
    </header>
  );
}
