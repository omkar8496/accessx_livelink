import { Suspense } from "react";
import { LoginForm } from "../LoginForm";

export const metadata = {
  title: "LiveLink Login",
  description: "Request access to the LiveLink control surface."
};

export default function LoginAccessxPage() {
  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-gradient-to-br from-[#fef3ec] via-white to-[#eff8ff] px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(224,68,32,0.08),_transparent_45%)]" />
      <div className="relative mx-auto w-full max-w-lg">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
