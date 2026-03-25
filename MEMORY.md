# System Memory & Context

## Active Phase & Goal
**Current Task:** Phase 2 — expand Trade Journal (trade list, CSV import, screenshots).  
**Next Steps:**
1. Add CSV import with preview and bulk insert.
2. Optional: trade detail route and filters.
3. Analytics dashboard slice.

## Architectural Decisions
- 2026-03-25 - Selected Next.js 14 App Router for frontend and server routes.
- 2026-03-25 - Selected Supabase for PostgreSQL, Auth, Storage, and Realtime in one managed platform.
- 2026-03-25 - Selected Tailwind + shadcn/ui for fast, consistent dark-theme UI delivery.
- 2026-03-25 - Selected Recharts for analytics visualizations.
- 2026-03-25 - Selected Vercel for deployment and preview environments.
- 2026-03-25 - Bootstrapped Next.js app in repo root and installed Supabase client dependencies.
- 2026-03-25 - Added first-pass auth flow (signup/login), session middleware, and protected `/dashboard` shell.
- 2026-03-25 - Added initial Supabase schema migration with RLS policies and auto-profile trigger.
- 2026-03-25 - Added email verification page with resend action and dashboard feature placeholder routes.
- 2026-03-25 - Added Trade Journal form: PnL/R-multiple preview, inserts into `trades` with RLS.
- 2026-03-25 - Journal page lists all trades (newest first) with signed screenshot previews from private Storage.

## Known Issues & Quirks
- No implementation issues logged yet; this file should be updated after each major milestone.

## Completed Phases
- [x] Documentation and agent setup
- [x] Initial scaffold
- [x] Database schema creation
- [x] Auth integration
- [x] Trade journal (manual log + save)
- [ ] Analytics dashboard
- [ ] Community feed
- [ ] Strategy builder
- [ ] AI feedback
- [ ] Launch readiness
