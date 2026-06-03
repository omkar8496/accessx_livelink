"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RequireLogin } from "@livelink/components/RequireLogin";
import EventHeader from "@livelink/components/header";
import { decodeBaseX } from "@livelink/lib/baseX";
import { clearAuthSession } from "@livelink/lib/authStorage";
import { fetchEventDetails } from "./api";

function decodeEventId(encoded) {
  if (!encoded) return null;
  try {
    return decodeBaseX(encoded);
  } catch {
    try {
      return atob(encoded);
    } catch {
      return null;
    }
  }
}

function getBasePath() {
  const raw = process.env.NEXT_PUBLIC_LIVELINK_BASE_PATH ?? "";
  if (!raw) return "";
  const withSlash = raw.startsWith("/") ? raw : `/${raw}`;
  return withSlash.replace(/\/$/, "");
}

export function AccessxShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const encodedEventId = searchParams.get("e") || "";
  const eventId = useMemo(() => decodeEventId(encodedEventId), [encodedEventId]);

  const search = useMemo(() => searchParams?.toString() ?? "", [searchParams]);
  const nextPath = useMemo(
    () => (search ? `${pathname}?${search}` : pathname),
    [pathname, search]
  );

  const [eventData, setEventData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadEvent() {
      if (!eventId) return;
      setLoading(true);
      setError("");
      try {
        const response = await fetchEventDetails({ eventId });
        if (!cancelled) {
          setEventData(response?.event ?? response);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load event details.");
          if (err?.status === 401 || err?.status === 403) {
            clearAuthSession();
            const basePath = getBasePath();
            const target = `${basePath || ""}/login?next=${encodeURIComponent(nextPath)}`;
            router.replace(target);
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    loadEvent();
    return () => {
      cancelled = true;
    };
  }, [eventId, nextPath, router]);

  return (
    <RequireLogin>
      <div className="min-h-[100dvh] w-full bg-[#f2f2f2] px-3 pb-8 pt-4 md:px-6">
        <div className="mx-auto w-full max-w-5xl">
          <EventHeader event={eventData} />

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading && !error && (
            <div className="mb-4 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-slate-600">
              Loading event details...
            </div>
          )}

          {children}
        </div>
      </div>
    </RequireLogin>
  );
}
