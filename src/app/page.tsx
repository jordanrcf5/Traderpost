import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0F1923] px-6 text-slate-100">
      <section className="w-full max-w-3xl rounded-xl border border-slate-700 bg-[#1E2D3D] p-8">
        <h1 className="text-3xl font-semibold">Traderpost</h1>
        <p className="mt-3 text-slate-300">
          Your entire trading life, one platform. Journal, analytics, and community in one focused workspace.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="rounded-md bg-[#00C896] px-4 py-2 font-medium text-slate-950 hover:opacity-90"
          >
            Create account
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-slate-600 px-4 py-2 font-medium hover:bg-slate-800"
          >
            Log in
          </Link>
        </div>
      </section>
    </main>
  );
}
