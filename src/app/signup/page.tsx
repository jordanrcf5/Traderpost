"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setMessage("Account created. Check your email to verify your account.");
    router.push(`/verify-email?email=${encodeURIComponent(email)}`);
  }

  return (
    <main className="min-h-screen bg-[#0F1923] text-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-[#1E2D3D] p-6">
        <h1 className="text-2xl font-semibold">Create your Traderpost account</h1>
        <p className="mt-2 text-sm text-slate-300">One login for your full trading workflow.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block text-sm">
            Email
            <input
              type="email"
              className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 outline-none focus:border-[#00C896]"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="block text-sm">
            Password
            <input
              type="password"
              className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 outline-none focus:border-[#00C896]"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
            />
          </label>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          {message ? <p className="text-sm text-emerald-400">{message}</p> : null}

          <button
            type="submit"
            className="w-full rounded-md bg-[#00C896] px-4 py-2 font-medium text-slate-950 hover:opacity-90 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-300">
          Already have an account?{" "}
          <Link href="/login" className="text-[#00C896]">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
