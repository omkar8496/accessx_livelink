import { Suspense } from "react";
import { AccessxShell } from "./components/AccessxShell";

export default function AccessxLayout({ children }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-dvh px-4 text-sm bg-(--bg-primary) text-(--text-secondary)">
          Loading...
        </div>
      }
    >
      <AccessxShell>{children}</AccessxShell>
    </Suspense>
  );
}
