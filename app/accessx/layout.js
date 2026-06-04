import { Suspense } from "react";
import { AccessxShell } from "./components/AccessxShell";

export default function AccessxLayout({ children }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[100dvh] px-4 text-sm bg-[color:var(--bg-primary)] text-[color:var(--text-secondary)]">
          Loading...
        </div>
      }
    >
      <AccessxShell>{children}</AccessxShell>
    </Suspense>
  );
}
