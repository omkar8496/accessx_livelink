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
    <header className="mb-6 rounded-2xl border border-black/5 bg-white px-5 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.12)] md:px-8">
      <div className="grid gap-4 md:grid-cols-[160px_1fr_auto] md:items-center">
        <div className="flex items-center">
          <Image
            src="/AtomX_Logo.svg"
            alt="AtomX"
            width={144}
            height={64}
            priority
            className="h-16 w-36 object-contain md:h-20 md:w-44"
          />
        </div>

        <div className="min-w-0">
          <h1 className="truncate text-2xl font-[family-name:var(--font-chillax)] font-semibold md:text-[28px]">
            {title}
          </h1>
          <div className="mt-1.5 flex min-w-0 items-center gap-2 text-sm font-medium text-[#686868] md:text-base">
            <span className="relative h-3.5 w-3.5 shrink-0 rounded-full bg-[#e94120] shadow-[0_0_0_2px_rgba(233,65,32,0.14)]">
              <span className="absolute left-1/2 top-full h-2 w-0.5 -translate-x-1/2 rounded-full bg-[#b62918]" />
            </span>
            <p className="truncate">{location}</p>
          </div>
        </div>

        <time className="self-start text-right text-sm font-bold leading-none text-[#444444] md:text-base">
          {formatHeaderTime(now)}
        </time>
      </div>
    </header>
  );
}
