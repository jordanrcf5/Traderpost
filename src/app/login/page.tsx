"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#0F1923] text-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-[#1E2D3D] p-6">
        <h1 className="text-2xl font-semibold">Log in to Traderpost</h1>
        <p className="mt-2 text-sm text-slate-300">Welcome back. Let&apos;s get locked in.</p>

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
            />
          </label>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button
            type="submit"
            className="w-full rounded-md bg-[#00C896] px-4 py-2 font-medium text-slate-950 hover:opacity-90 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-300">
          New here?{" "}
          <Link href="/signup" className="text-[#00C896]">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
