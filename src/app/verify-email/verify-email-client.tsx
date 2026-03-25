"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function resendVerification() {
    if (!email) {
      setError("No email found. Please sign up again.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    setLoading(false);

    if (resendError) {
      setError(resendError.message);
      return;
    }

    setMessage("Verification email sent. Check your inbox.");
  }

  return (
    <main className="min-h-screen bg-[#0F1923] text-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-lg rounded-xl border border-slate-700 bg-[#1E2D3D] p-6">
        <h1 className="text-2xl font-semibold">Verify your email</h1>
        <p className="mt-2 text-sm text-slate-300">
          We sent a verification link to {email || "your email address"}. Click it to activate your account.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-md bg-[#00C896] px-4 py-2 font-medium text-slate-950 hover:opacity-90 disabled:opacity-60"
            onClick={resendVerification}
            disabled={loading}
          >
            {loading ? "Sending..." : "Resend verification email"}
          </button>
          <Link
            href="/login"
            className="rounded-md border border-slate-600 px-4 py-2 font-medium hover:bg-slate-800"
          >
            Back to login
          </Link>
        </div>

        {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
        {message ? <p className="mt-4 text-sm text-emerald-400">{message}</p> : null}
      </div>
    </main>
  );
}
