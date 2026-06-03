import { Suspense } from "react";
import { AccessxShell } from "./components/AccessxShell";

export default function AccessxLayout({ children }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100dvh] items-center justify-center bg-[#f2f2f2] px-4 text-sm text-slate-600">
          Loading...
        </div>
      }
    >
      <AccessxShell>{children}</AccessxShell>
    </Suspense>
  );
}
