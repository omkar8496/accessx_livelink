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
    hour12: false,
  });
}

export default function EventHeader({ event }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const title = readEventValue(
    event,
    ["name", "eventName", "event_name", "title"],
    "Event Name",
  );
  const venue = readEventValue(
    event,
    ["venue", "venueName", "venue_name", "location"],
    "Venue",
  );
  const city = readEventValue(event, ["city", "eventCity"], "City");
  const country = readEventValue(event, ["country", "eventCountry"], "Country");
  const location = useMemo(
    () =>
      [venue, [city, country].filter(Boolean).join(", ")]
        .filter(Boolean)
        .join("  •  "),
    [city, country, venue],
  );

  return (
    <header className="w-full bg-(var--egg-white) px-3 pb-4 pt-4 md:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur shadow-lg ring-1 ring-black/10">
          <div className="flex flex-col items-center gap-3 p-4 text-center md:flex-row md:items-center md:gap-4 md:p-4 md:text-left">
            <div className="flex h-8 items-center justify-center">
              <Image
                src="/AtomX_Logo.svg"
                style={{ color: "transparent" }}
                alt="AtomX"
                width={62}
                height={12}
                decoding="async"
                data-nmig="1"
                priority
                className="h-44 w-auto object-contain"
              />
            </div>
            <div className="h-px w-full bg-neutral-200 md:hidden"></div>

            <div className="flex-1 md:text-left">
              <h1 className="truncate text-(--text-primary) font-(family-name:--font-chillax) font-(--fw-semibold) text-lg md:text-xl leading-tight">
                {title}
              </h1>

              <div className="mt-1 flex min-w-0 items-center gap-2 text-sm font-(--fw-medium) text-(--text-secondary) md:text-base">
                <span className="relative h-3.5 w-3.5 shrink-0 rounded-full bg-(--light-blue) shadow-[0_0_0_2px_rgba(0,169,242,0.14)]">
                  <span className="absolute left-1/2 top-full h-2 w-0.5 -translate-x-1/2 rounded-full bg-(--light-blue)" />
                </span>

                <p className="truncate">{location}</p>
              </div>
            </div>

            <time
              aria-live="polite"
              aria-label={`Current time: ${formatHeaderTime(now)}`}
              className="mt-2 text-center text-sm font-(--fw-bold) text-(--text-tertiary) tabular-nums md:absolute md:right-6 md:top-6 md:mt-0 md:text-right md:text-base"
            >
              {formatHeaderTime(now)}
            </time>
          </div>
        </div>
      </div>
    </header>
  );
}
