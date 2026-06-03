"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getAuthSession } from "@livelink/lib/authStorage";

function getBasePath() {
  const raw = process.env.NEXT_PUBLIC_LIVELINK_BASE_PATH ?? "";
  if (!raw) return "";
  const withSlash = raw.startsWith("/") ? raw : `/${raw}`;
  return withSlash.replace(/\/$/, "");
}

export function RequireLogin({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isAuthorized, setIsAuthorized] = useState(false);

  const nextPath = useMemo(() => {
    const search = searchParams?.toString();
    return search ? `${pathname}?${search}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    if (getAuthSession()) {
      queueMicrotask(() => setIsAuthorized(true));
      return;
    }

    const basePath = getBasePath();
    router.replace(`${basePath}/login?next=${encodeURIComponent(nextPath)}`);
  }, [nextPath, router]);

  if (!isAuthorized) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#f2f2f2] px-4 text-sm text-slate-600">
        Checking access...
      </div>
    );
  }

  return children;
}
