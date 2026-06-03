"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { decodeBaseX } from "app/lib/baseX";
import { requestLivelinkOtp, verifyLivelinkOtp } from "app/api/auth";
import { getAuthSession, saveAuthSession } from "app/lib/authStorage";

function extractEncodedCode(searchParams) {
  const direct = searchParams.get("e");
  if (direct) return direct;

  const next = searchParams.get("next");
  if (!next) return null;

  try {
    const parsed = new URL(next, "http://placeholder.local");
    return parsed.searchParams.get("e");
  } catch {
    return null;
  }
}

function decodeAccessCode(encoded) {
  if (!encoded) return { code: null, error: "Missing access code in URL." };
  try {
    return { code: decodeBaseX(encoded), error: null };
  } catch {
    try {
      return { code: atob(encoded), error: null };
    } catch {
      return { code: null, error: "Invalid access code." };
    }
  }
}

function getBasePath() {
  const raw = process.env.NEXT_PUBLIC_LIVELINK_BASE_PATH ?? "";
  if (!raw) return "";
  const withSlash = raw.startsWith("/") ? raw : `/${raw}`;
  return withSlash.replace(/\/$/, "");
}

function stripBasePath(pathname = "") {
  const basePath = getBasePath();
  if (basePath && pathname.startsWith(basePath)) {
    const stripped = pathname.slice(basePath.length);
    return stripped.startsWith("/") ? stripped : `/${stripped}`;
  }
  return pathname || "/";
}

function ensureBasePath(pathname = "") {
  const basePath = getBasePath();
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (!basePath) return normalized;
  return normalized.startsWith(basePath) ? normalized : `${basePath}${normalized}`;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const encodedCode = useMemo(() => extractEncodedCode(searchParams), [searchParams]);
  const decodedCode = useMemo(() => decodeAccessCode(encodedCode), [encodedCode]);

  const nextTarget = useMemo(() => {
    const rawNext = searchParams.get("next");
    let target = "/accessx";

    if (rawNext) {
      const normalized = rawNext.startsWith("/") ? rawNext : `/${rawNext}`;
      const isAbsolute = /^https?:/i.test(rawNext) || normalized.startsWith("//");
      if (!isAbsolute && !normalized.startsWith("/login")) {
        target = stripBasePath(normalized);
      }
    }

    // Preserve the encoded event code when coming from e=...
    if (encodedCode) {
      const hasQuery = target.includes("?");
      const joiner = hasQuery ? "&" : "?";
      const alreadyHasE = target.includes("e=");
      if (!alreadyHasE) {
        target = `${target}${joiner}e=${encodedCode}`;
      }
    }
    return target;
  }, [searchParams, encodedCode]);

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | verifying | verified
  const [codeSent, setCodeSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    const session = getAuthSession();
    if (session?.email) {
      queueMicrotask(() => setEmail(session.email));
      const targetPath = stripBasePath(nextTarget) || "/";
      const destination = ensureBasePath(targetPath);
      if (typeof window !== "undefined") {
        const absolute = new URL(destination, window.location.origin);
        window.location.href = absolute.toString();
      } else {
        router.replace(destination);
      }
    }
  }, [nextTarget, router]);

  const hasSent = codeSent;
  const numericCode = useMemo(() => {
    if (!decodedCode.code) return null;
    const next = Number(decodedCode.code);
    return Number.isFinite(next) ? next : null;
  }, [decodedCode]);

  useEffect(() => {
    if (!resendCooldown) return undefined;
    const id = setInterval(() => {
      setResendCooldown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  const sendOtp = async (trimmedEmail, numericCodeValue) => {
    setStatus("sending");
    await requestLivelinkOtp({ email: trimmedEmail, code: numericCodeValue });
    setCodeSent(true);
    setStatus("sent");
    setResendCooldown(30);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Enter your email to continue.");
      return;
    }

    if (!decodedCode.code) {
      setError(decodedCode.error || "Access code missing.");
      return;
    }

    if (!Number.isFinite(numericCode)) {
      setError("Access code must be numeric.");
      return;
    }

    const trimmedEmail = email.trim();

    try {
      if (!hasSent) {
        await sendOtp(trimmedEmail, numericCode);
        return;
      }

      if (!otp.trim()) {
        setError("Enter the OTP you received.");
        return;
      }

      setStatus("verifying");
      const verified = await verifyLivelinkOtp({ email: trimmedEmail, code: numericCode, otp: otp.trim() });
      if (!verified?.token) {
        throw new Error("Missing token in response. Please try again.");
      }
      saveAuthSession({ email: trimmedEmail, token: verified.token });
      setStatus("verified");
      const targetPath = stripBasePath(nextTarget) || "/";
      const destination = ensureBasePath(targetPath);
      if (typeof window !== "undefined") {
        const absolute = new URL(destination, window.location.origin);
        window.location.href = absolute.toString();
      } else {
        router.replace(destination);
      }
    } catch (err) {
      setStatus(hasSent ? "sent" : "idle");
      setError(err.message || "Unable to send OTP. Please try again.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-white/50 bg-white/80 p-8 shadow-2xl backdrop-blur">
      <div className="mb-6 space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#e04420]">LiveLink</p>
        <h1 className="text-2xl font-semibold text-slate-900">Sign in to continue</h1>
        <p className="text-sm text-slate-600">
          Enter your email to request a one-time code.
        </p>
      </div>

      {decodedCode.error && (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
          {decodedCode.error} Add the <code>e</code> query parameter from your invite link.
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="email">
            email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 shadow-inner outline-none focus:border-[#e04420] focus:ring-2 focus:ring-[#e04420]/30"
            placeholder="you@company.com"
          />
        </div>

        {hasSent && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="otp">
              One-time code
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 shadow-inner outline-none focus:border-[#e04420] focus:ring-2 focus:ring-[#e04420]/30"
              placeholder="Enter the code sent to your email"
            />
            <p className="text-xs text-slate-500">
              We sent an OTP to <span className="font-semibold text-slate-700">{email || "your email"}</span>.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            type="submit"
            disabled={status === "sending" || status === "verifying" || Boolean(decodedCode.error)}
            className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white transition ${
              status === "sending" || status === "verifying" || decodedCode.error
                ? "cursor-not-allowed bg-slate-300"
                : "bg-[#e04420] shadow-lg shadow-[#e04420]/30 hover:brightness-95"
            }`}
          >
            {status === "sending"
              ? "Sending code…"
              : hasSent
                ? status === "verifying"
                  ? "Verifying…"
                  : "Verify code"
                : "Send code"}
          </button>

          {hasSent && (
            <button
              type="button"
              disabled={
                status === "sending" ||
                status === "verifying" ||
                resendCooldown > 0 ||
                Boolean(decodedCode.error)
              }
              onClick={() => sendOtp(email.trim(), numericCode)}
              className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                status === "sending" || status === "verifying" || resendCooldown > 0 || decodedCode.error
                  ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
                  : "border border-[#e04420] bg-white text-[#e04420] hover:bg-[#fff3ed]"
              }`}
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
            </button>
          )}

          <div className="text-center text-xs text-slate-500 space-y-1">
            <p>By continuing, you will receive a LiveLink access code at the email provided.</p>
            {hasSent && <p className="text-slate-500">Enter the OTP to finish sign-in.</p>}
          </div>
        </div>
      </form>
    </div>
  );
}
