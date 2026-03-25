import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-slate-300">
        Welcome{user?.email ? `, ${user.email}` : ""}. Phase 1 foundation is live.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-700 bg-[#1E2D3D] p-4">
          <p className="text-sm text-slate-300">Trade Journal</p>
          <p className="mt-1 font-medium">Coming in next slice</p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-[#1E2D3D] p-4">
          <p className="text-sm text-slate-300">Analytics</p>
          <p className="mt-1 font-medium">Coming in next slice</p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-[#1E2D3D] p-4">
          <p className="text-sm text-slate-300">Community</p>
          <p className="mt-1 font-medium">Coming in next slice</p>
        </div>
      </div>
    </main>
  );
}
