import type { ReactNode } from "react";
import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/journal", label: "Journal" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/community", label: "Community" },
  { href: "/dashboard/strategy", label: "Strategy" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0F1923] text-slate-100">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="border-r border-slate-800 p-4">
          <h2 className="text-lg font-semibold text-[#00C896]">TRADERPOST</h2>
          <nav className="mt-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <section className="p-6">{children}</section>
      </div>
    </div>
  );
}
