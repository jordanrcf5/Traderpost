# AGENTS.md - Master Plan for Traderpost

## Project Overview & Stack
**App:** Traderpost  
**Overview:** Traderpost is an all-in-one trading platform for serious traders who currently juggle separate tools for journaling, analytics, and community. The MVP focuses on helping traders log trades quickly, review performance patterns, and share insights in one place.  
**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Recharts, Supabase (PostgreSQL/Auth/Storage/Realtime), Anthropic Claude API, Vercel  
**Critical Constraints:** 30-day MVP timeline, near-zero launch budget, security-first handling of trading data, desktop-first UX, keep implementation incremental and testable.

## Setup & Commands
Execute these commands for standard development workflows.
- **Setup:** `npm install`
- **Development:** `npm run dev`
- **Testing:** `npm test`
- **Linting & Formatting:** `npm run lint`
- **Build:** `npm run build`

## How I Should Think
1. **Understand Intent First**: Identify what the user actually needs before changing code.
2. **Ask If Unsure**: If critical information is missing, ask one clear question.
3. **Plan Before Coding**: Propose a brief plan and wait for approval before multi-file implementation.
4. **Verify After Changes**: Run tests, lint, and relevant manual checks after each feature.
5. **Explain Trade-offs**: Mention alternatives when proposing architecture or dependencies.

## Plan -> Execute -> Verify
1. **Plan:** Outline approach for the next slice of work and get approval.
2. **Execute:** Implement one feature slice at a time (small, reviewable changes).
3. **Verify:** Run checks, fix failures, then update state docs.

## Protected Areas
Do NOT modify these areas without explicit human approval:
- **Infrastructure:** `infrastructure/`, Dockerfiles, and deployment workflows in `.github/workflows/`
- **Database Migrations:** Existing migration files once established
- **Third-Party Integrations:** Billing/auth provider wiring after initial setup

## Context Files (Progressive Disclosure)
Read only what is needed for the current task:
- `agent_docs/tech_stack.md` - full stack, architecture, setup commands
- `agent_docs/code_patterns.md` - coding conventions and examples
- `agent_docs/project_brief.md` - persistent rules and workflow expectations
- `agent_docs/product_requirements.md` - PRD source-of-truth requirements
- `agent_docs/testing.md` - verification strategy and quality gates
- `MEMORY.md` - active phase, decisions, known issues

## Current State
**Last Updated:** 2026-03-25  
**Working On:** Phase 1 foundation complete in codebase; pending Supabase dashboard project configuration  
**Recently Completed:** Next.js scaffold, auth foundation, schema migration file, dashboard route placeholders, env template  
**Blocked By:** None

## Roadmap

### Phase 1: Foundation
- [x] Initialize Next.js 14 TypeScript app structure
- [ ] Configure Supabase project and apply schema
- [x] Configure auth flow (signup/login/email verify)
- [x] Add environment variable management and secret handling

### Phase 2: Core MVP Features
- [ ] Trade Journal (manual logging, screenshot upload, CSV import)
- [ ] Analytics Dashboard (PnL, win rate, RR, profit factor, drawdown, filters)
- [ ] Community Feed (posts, likes, comments, follows, real-time updates)

### Phase 3: Extended MVP Features
- [ ] Strategy Builder (CRUD strategy rules and linking)
- [ ] AI Trade Feedback (strategy-vs-trade compliance analysis)
- [ ] Onboarding Quiz personalization flow

### Phase 4: Quality, Security, and Launch
- [ ] Security hardening checklist complete
- [ ] Cross-browser verification and responsive checks
- [ ] Deploy to Vercel with environment variables
- [ ] Beta test with 3-5 traders and iterate

## Must-Have Features (From PRD)
- Trade Journal
- Analytics Dashboard
- Community Feed

## Nice-to-Have / High Priority Additions
- Strategy Builder
- AI Trade Feedback (can defer to V1b if timeline risk)

## Not in MVP (Explicitly Excluded)
- Backtester
- Trading Tracker expansion
- Prop Firm Tools
- Mobile App
- Algo Strategy Builder
- TradingView-style Charts
- Full Broker OAuth Sync (CSV fallback in V1)

## What NOT To Do
- Do NOT delete files without explicit confirmation.
- Do NOT modify database schemas without a backup/migration plan.
- Do NOT add features outside the active phase.
- Do NOT skip tests for "simple" changes.
- Do NOT bypass failing tests or hooks without explicit permission.
- Do NOT use deprecated libraries or outdated patterns.

## Working Style for Level A (Vibe-coder)
- Keep explanations practical and short: what changed, how to test, what is next.
- Favor reliable, common patterns over clever abstractions.
- Build thin vertical slices so progress is visible quickly.
- Avoid context resets: keep `MEMORY.md` updated after milestones.
