import { Suspense } from "react";
import VerifyEmailClient from "./verify-email-client";

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#0F1923] text-slate-100 flex items-center justify-center px-6">
          <div className="w-full max-w-lg rounded-xl border border-slate-700 bg-[#1E2D3D] p-6">
            <p className="text-sm text-slate-300">Loading verification page...</p>
          </div>
        </main>
      }
    >
      <VerifyEmailClient />
    </Suspense>
  );
}
