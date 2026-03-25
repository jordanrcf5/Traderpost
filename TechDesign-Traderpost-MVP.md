# Technical Design Document: Traderpost MVP

## Overview

This document explains exactly HOW we'll build Traderpost — the all-in-one trading ecosystem defined in the PRD. Every decision below is made for a first-time vibe coder prioritizing reliability, scalability, and zero surprise costs.

---

## Recommended Approach

### Best Path: AI-Assisted Web App with Managed Backend

**Primary Approach: Next.js + Supabase + Vercel + Cursor**

- **Why this works for you:** Every service has a generous free tier, the AI coding tools know this stack better than any other, and it scales to thousands of users without changing a single line of architecture
- **Time to MVP:** 30 days at 2–3 hours/day
- **Learning curve:** Low — Cursor writes the code, you guide and test
- **Cost at launch:** $0/month
- **Cost at 1,000 users:** ~$0–25/month
- **Cost at 10,000 users:** ~$25–75/month

---

### Alternative Options Compared

| Option | Pros | Cons | Cost | Time to MVP |
|---|---|---|---|---|
| **Next.js + Supabase (Recommended)** | AI knows it best, scales well, free tier generous, all-in-one backend | Requires learning some concepts | $0 | 30 days |
| Lovable / Bolt.new (No-code) | Fastest start, pure describe-to-build | Hard to customize, locks you in, paid fast | $20–50/mo | 1–2 weeks |
| Firebase + React | Good real-time, Google backed | Costs spike unpredictably at scale, harder to query | $0–??? | 4–5 weeks |
| Remix + PlanetScale | Great performance | More complex, smaller AI training data | $0 | 5–6 weeks |

**Why NOT Lovable/Bolt for Traderpost specifically:** The trade journal requires complex data relationships (trades → analytics → AI feedback → strategies). Visual builders hit their ceiling fast on data-heavy apps and you end up rebuilding anyway.

---

## Tech Stack — Final Decisions

### Frontend
- **Framework:** Next.js 14 (App Router)
  - *Why:* The most AI-understood framework on the planet. Cursor will write perfect Next.js code every time. Built-in routing, server components, and API routes mean you need fewer tools.
  - *Learning time:* You don't need to learn it — Cursor handles it. You'll absorb it as you go.

- **Styling:** Tailwind CSS
  - *Why:* AI writes Tailwind perfectly. Dark dashboard aesthetic is easy. No separate CSS files to manage.

- **UI Components:** shadcn/ui
  - *Why:* Free, beautiful, copy-paste components. Charts, tables, forms, dialogs — all pre-built. Matches the professional dark aesthetic from your PRD perfectly.

- **Charts:** Recharts (for analytics dashboard)
  - *Why:* Free, React-native, works with shadcn. Handles PnL curves, bar charts, and all analytics metrics from your PRD.

### Backend + Database + Auth
- **Platform:** Supabase (your entire backend in one place)
  - *Why:* Replaces 4 separate services — database, authentication, file storage, and real-time updates. Free tier is extremely generous. No credit card required to start. Costs are predictable and capped.
  - *Free tier includes:* 500MB database, 1GB file storage, 50MB bandwidth/day, unlimited auth users

- **Database:** PostgreSQL (inside Supabase)
  - *Why:* The most reliable, scalable database in the world. Your trade data is safe. Scales to millions of records without changing anything.

- **Auth:** Supabase Auth
  - *Why:* Email/password, magic links, and OAuth (Google) all built in. Handles JWT, sessions, and refresh tokens automatically. Secure by default.

- **File Storage:** Supabase Storage
  - *Why:* Used for chart screenshot uploads in journal entries. Free tier covers MVP easily.

- **Real-time:** Supabase Realtime
  - *Why:* Powers the live community feed (new posts appear without refreshing). Built into Supabase — no extra service needed.

### AI Trade Feedback
- **Provider:** Anthropic Claude API (claude-haiku-4-5 model)
  - *Why:* Cheapest capable model — roughly $0.001 per trade feedback request. At 1,000 feedback requests/month that's $1. Even at 100,000 requests that's $100. Costs scale with usage, not with users.
  - *Alternative:* OpenAI GPT-4o-mini is similar pricing if you want a backup option
  - *Important:* API key stored in Supabase Edge Functions — never exposed to the browser

### Hosting + Deployment
- **Platform:** Vercel
  - *Why:* Push code to GitHub → Vercel deploys automatically. Free tier handles MVP traffic. No server management. Instant rollback if something breaks.
  - *Free tier includes:* 100GB bandwidth, unlimited deployments, custom domain support

### AI Coding Tool
- **Primary:** Cursor
  - *Why:* Best vibe coding experience available. Understands your entire codebase, not just one file. Can read your PRD and TDD and write code that matches your spec. Has a free tier to start.
  - *Cost:* Free tier (limited), Pro is $20/month — worth it if you're coding 2–3 hours daily
  - *Alternative:* Windsurf (free, similar to Cursor) if you want to stay at $0

### Cost Control Strategy
- **Supabase:** Free tier, no credit card required. Set up billing alerts before adding card.
- **Vercel:** Free tier covers all MVP traffic. Only upgrade when you have revenue.
- **Claude API:** Set a hard monthly budget cap of $5 in Anthropic dashboard. Users on free tier get 5 AI feedback requests/month max.
- **Total at launch:** $0/month
- **Total at 500 users:** $0–20/month
- **First dollar spent:** Only when you choose to upgrade

---

## Project Structure

```
traderpost/
├── app/                        # Next.js App Router — all pages live here
│   ├── (auth)/                 # Auth pages (login, signup, verify)
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/            # Protected pages (require login)
│   │   ├── layout.tsx          # Sidebar + nav layout
│   │   ├── page.tsx            # Dashboard home
│   │   ├── journal/            # Trade journal
│   │   │   ├── page.tsx        # Journal list
│   │   │   └── [id]/page.tsx   # Single trade entry
│   │   ├── analytics/page.tsx  # Analytics dashboard
│   │   ├── community/page.tsx  # Community feed
│   │   ├── strategy/page.tsx   # Strategy builder
│   │   └── settings/page.tsx   # Account settings
│   ├── api/                    # API routes (server-side only)
│   │   ├── ai-feedback/        # AI trade feedback endpoint
│   │   └── import-trades/      # CSV import processing
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles (Tailwind)
├── components/
│   ├── ui/                     # shadcn/ui base components
│   ├── journal/                # Journal-specific components
│   │   ├── TradeForm.tsx       # Log new trade form
│   │   ├── TradeCard.tsx       # Trade entry card
│   │   └── TradeList.tsx       # Journal list view
│   ├── analytics/              # Analytics components
│   │   ├── PnLChart.tsx        # Equity curve
│   │   ├── WinRateChart.tsx    # Win rate donut
│   │   └── StatsGrid.tsx       # Metric cards
│   ├── community/              # Feed components
│   │   ├── PostCard.tsx        # Single post
│   │   ├── ComposeBox.tsx      # Write a post
│   │   └── Feed.tsx            # Posts list
│   ├── strategy/               # Strategy builder components
│   └── shared/                 # Shared across features
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       └── OnboardingQuiz.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   └── server.ts           # Server Supabase client
│   ├── utils/
│   │   ├── calculations.ts     # PnL, RR, win rate math
│   │   ├── csv-parser.ts       # CSV trade import logic
│   │   └── formatters.ts       # Number/date formatting
│   └── types/
│       └── index.ts            # All TypeScript types
├── public/                     # Static assets
├── .env.local                  # Secret keys (NEVER commit this)
├── .env.example                # Template for env vars (commit this)
├── package.json
└── README.md
```

---

## Database Schema

This is the exact structure of your Supabase database. Every table maps directly to a feature in your PRD.

```sql
-- ============================================================
-- USERS (handled by Supabase Auth automatically)
-- Extended with profile info
-- ============================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE,
    display_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    trading_style VARCHAR(50),         -- 'day', 'swing', 'scalp', 'position'
    experience_level VARCHAR(20),      -- 'beginner', 'intermediate', 'advanced'
    preferred_instruments TEXT[],      -- ['NQ', 'ES', 'BTC']
    onboarding_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- STRATEGIES (Feature 4 — Strategy Builder)
-- ============================================================
CREATE TABLE strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    instruments TEXT[],                -- ['NQ', 'ES']
    sessions TEXT[],                   -- ['NY', 'London', 'Asian']
    entry_rules TEXT,
    exit_rules TEXT,
    risk_rules TEXT,
    invalidation_rules TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_strategies_user_id ON strategies(user_id);

-- ============================================================
-- TRADES (Feature 1 — Trade Journal)
-- Core table — everything links to this
-- ============================================================
CREATE TABLE trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    strategy_id UUID REFERENCES strategies(id) ON DELETE SET NULL,

    -- Trade Details
    instrument VARCHAR(50) NOT NULL,           -- 'NQ', 'BTC', 'EUR/USD'
    direction VARCHAR(10) NOT NULL,            -- 'long' or 'short'
    entry_price DECIMAL(20, 8) NOT NULL,
    exit_price DECIMAL(20, 8) NOT NULL,
    position_size DECIMAL(20, 8) NOT NULL,
    pnl DECIMAL(20, 8),                        -- auto-calculated
    risk_reward_ratio DECIMAL(10, 4),          -- auto-calculated

    -- Context
    trade_date TIMESTAMP NOT NULL,
    session VARCHAR(20),                       -- 'london', 'ny', 'asian', 'overnight'
    setup_type VARCHAR(100),                   -- 'FVG', 'OB', 'BOS', etc.

    -- Reflection
    emotion_tags TEXT[],                       -- ['focused', 'fomo', 'patient']
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    notes TEXT,
    screenshot_url TEXT,                       -- Supabase Storage URL

    -- AI Feedback
    ai_feedback JSONB,                         -- Stored AI response
    ai_feedback_requested_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_trades_user_id ON trades(user_id);
CREATE INDEX idx_trades_trade_date ON trades(trade_date);
CREATE INDEX idx_trades_instrument ON trades(instrument);
CREATE INDEX idx_trades_session ON trades(session);

-- ============================================================
-- COMMUNITY POSTS (Feature 3 — Community Feed)
-- ============================================================
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    trade_id UUID REFERENCES trades(id) ON DELETE SET NULL,   -- optional link to trade

    post_type VARCHAR(20) NOT NULL,            -- 'recap', 'setup', 'journal_share', 'general'
    content TEXT NOT NULL,
    image_url TEXT,
    tags TEXT[],

    -- Moderation
    is_flagged BOOLEAN DEFAULT FALSE,
    flag_count INTEGER DEFAULT 0,
    is_removed BOOLEAN DEFAULT FALSE,

    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- ============================================================
-- POST LIKES
-- ============================================================
CREATE TABLE post_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(post_id, user_id)                   -- can't like twice
);

-- ============================================================
-- POST COMMENTS
-- ============================================================
CREATE TABLE post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comments_post_id ON post_comments(post_id);

-- ============================================================
-- FOLLOWS
-- ============================================================
CREATE TABLE follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    following_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) — Critical for data privacy
-- Users can ONLY see their own trades and strategies
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Trades: private to owner only
CREATE POLICY "Users can only access their own trades"
ON trades FOR ALL USING (auth.uid() = user_id);

-- Strategies: private to owner only
CREATE POLICY "Users can only access their own strategies"
ON strategies FOR ALL USING (auth.uid() = user_id);

-- Posts: readable by everyone, writable by owner
CREATE POLICY "Posts are publicly readable"
ON posts FOR SELECT USING (is_removed = FALSE);

CREATE POLICY "Users can create their own posts"
ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can edit their own posts"
ON posts FOR UPDATE USING (auth.uid() = user_id);
```

---

## Building Each Feature

### Feature 1: Trade Journal

**Complexity:** Medium (most important — build this first)

**Implementation Steps:**

1. **Database:** Tables above are already defined — set up in Supabase dashboard
2. **Trade Form Component** — Cursor prompt to use:
```
Create a TradeForm.tsx component for a trading journal app using Next.js, 
Supabase, Tailwind CSS, and shadcn/ui.

The form should include fields for:
- Instrument (dropdown: NQ, ES, BTC, ETH, EUR/USD, GBP/USD, Gold, Other)
- Direction (Long/Short toggle buttons)
- Entry price, Exit price, Position size (number inputs)
- PnL and RR ratio (auto-calculated, read-only display)
- Trade date/time (datetime picker)
- Session (dropdown: London, New York, Asian, Overnight)
- Setup type (text input with tag suggestions: FVG, OB, BOS, CHoCH, Liquidity Sweep)
- Strategy (dropdown from user's saved strategies)
- Emotion tags (multi-select: Focused, Patient, FOMO, Revenge, Overconfident, Anxious)
- Trade rating (1-5 star selector)
- Notes (textarea)
- Screenshot upload (image upload to Supabase Storage)

Auto-calculate PnL and RR when entry/exit/size change.
Dark theme matching the design: background #0F1923, accent #00C896.
Save to Supabase trades table on submit.
```

3. **CSV Import** — Cursor prompt:
```
Create a CSV import feature for the Traderpost trade journal.
Build a CSVImportModal.tsx component that:
- Accepts a CSV file upload
- Shows a preview table of the parsed data
- Maps CSV columns to trade fields (instrument, entry, exit, size, date)
- Validates the data before import
- Bulk inserts valid rows to Supabase trades table
- Shows import results (X successful, Y failed with reasons)
Use Next.js, Supabase, Tailwind, shadcn/ui. Dark theme.
```

**Test by:** Log 3 trades manually, verify PnL calculates correctly, upload a CSV with 5 trades and confirm they appear.

---

### Feature 2: Analytics Dashboard

**Complexity:** Medium

**Key calculations to implement:**

```typescript
// lib/utils/calculations.ts
// Cursor prompt: "Implement these trading analytics calculations in TypeScript"

export function calculateWinRate(trades: Trade[]): number {
  const winners = trades.filter(t => t.pnl > 0).length
  return trades.length > 0 ? (winners / trades.length) * 100 : 0
}

export function calculateProfitFactor(trades: Trade[]): number {
  const grossProfit = trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0)
  const grossLoss = Math.abs(trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0))
  return grossLoss > 0 ? grossProfit / grossLoss : grossProfit
}

export function calculateMaxDrawdown(trades: Trade[]): number {
  // Running equity curve, find largest peak-to-trough
  let peak = 0
  let maxDrawdown = 0
  let runningPnl = 0
  for (const trade of trades) {
    runningPnl += trade.pnl
    if (runningPnl > peak) peak = runningPnl
    const drawdown = peak - runningPnl
    if (drawdown > maxDrawdown) maxDrawdown = drawdown
  }
  return maxDrawdown
}

export function buildEquityCurve(trades: Trade[]): { date: string; pnl: number }[] {
  let running = 0
  return trades.map(t => ({
    date: t.trade_date,
    pnl: (running += t.pnl)
  }))
}
```

**Cursor prompt for dashboard:**
```
Create an analytics dashboard page for Traderpost using Next.js, Recharts, 
Supabase, Tailwind CSS, and shadcn/ui.

Fetch the current user's trades from Supabase and display:
- Stats cards row: Total PnL, Win Rate %, Profit Factor, Max Drawdown, 
  Total Trades, Average RR
- PnL equity curve line chart (date vs cumulative PnL)
- Win/Loss donut chart
- Performance by session bar chart (NY, London, Asian, Overnight)
- Performance by setup type bar chart
- Best and worst trade cards

Include a date range filter (1W, 1M, 3M, All Time) and instrument filter.
Dark theme: background #0F1923, accent green #00C896, card background #1E2D3D.
```

**Test by:** Log 10+ trades with different outcomes and verify all calculations are correct.

---

### Feature 3: Community Feed

**Complexity:** Medium (real-time updates make this interesting)

**Cursor prompt:**
```
Create a community feed for Traderpost using Next.js, Supabase Realtime,
Tailwind CSS, and shadcn/ui.

Build these components:
1. Feed.tsx — list of posts, infinite scroll, real-time new post updates
2. PostCard.tsx — displays post with: avatar, username, content, image (optional),
   trade tag (optional), like button with count, comment count, share button,
   report button, timestamp
3. ComposeBox.tsx — text area with image upload, post type selector 
   (recap/setup/general), hashtag support, 500 char limit, submit button

Use Supabase Realtime to subscribe to new posts and show them at top of feed 
without page refresh.

Include rate limiting: users can post max 10 times per hour (track in localStorage 
and enforce server-side).

Dark theme: background #0F1923, accent #00C896, card #1E2D3D.
```

**Spam/bot prevention implementation:**
```
Add these safety features to the Traderpost community feed:
1. Email verification check before allowing posts (check profiles.email_confirmed)
2. Rate limiting: max 10 posts per hour per user (enforce in API route)
3. Content length minimum: posts must be at least 10 characters
4. Profanity filter: use the 'bad-words' npm package to filter post content
5. Report system: report button adds to flag_count, auto-hide at 5 flags
6. No external links in first 7 days of account (anti-spam)
```

**Test by:** Open two browser windows, post from one, verify it appears in the other in real time.

---

### Feature 4: Strategy Builder

**Complexity:** Easy

**Cursor prompt:**
```
Create a strategy builder for Traderpost using Next.js, Supabase, Tailwind, shadcn/ui.

Build:
1. StrategyList.tsx — shows all user's saved strategies with edit/delete/activate buttons
2. StrategyForm.tsx — form to create/edit a strategy with fields:
   - Strategy name (text input)
   - Instruments (multi-select: NQ, ES, BTC, ETH, Forex pairs, Stocks)
   - Sessions (multi-select: London, New York, Asian, Overnight)
   - Entry rules (textarea — plain text rules)
   - Exit rules (textarea)
   - Risk rules (textarea — e.g. "Max 1% per trade, max 2 trades/day")
   - Invalidation conditions (textarea)
3. Strategies saved to Supabase strategies table
4. Active strategy shown in trade journal form dropdown

Dark theme, clean card layout.
```

---

### Feature 5: AI Trade Feedback

**Complexity:** Medium (requires secure API route)

**IMPORTANT — API key security:** The Claude API key must NEVER go in frontend code. It lives only in a Next.js API route (server-side).

**API route implementation:**

```typescript
// app/api/ai-feedback/route.ts
// Cursor prompt: "Create this exact API route for AI trade feedback"

import Anthropic from "@anthropic-ai/sdk"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  // 1. Verify user is authenticated
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  // 2. Get trade and strategy from request
  const { tradeId, strategyId } = await request.json()

  // 3. Fetch trade details from database
  const { data: trade } = await supabase
    .from("trades").select("*").eq("id", tradeId).single()

  const { data: strategy } = await supabase
    .from("strategies").select("*").eq("id", strategyId).single()

  if (!trade || !strategy) {
    return Response.json({ error: "Trade or strategy not found" }, { status: 404 })
  }

  // 4. Call Claude API (key is server-side only)
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const prompt = `You are a trading coach analyzing a trade against a trader's strategy.

TRADER'S STRATEGY: ${strategy.name}
Entry Rules: ${strategy.entry_rules}
Exit Rules: ${strategy.exit_rules}
Risk Rules: ${strategy.risk_rules}
Sessions: ${strategy.sessions?.join(", ")}
Instruments: ${strategy.instruments?.join(", ")}
Invalidation: ${strategy.invalidation_rules}

TRADE TAKEN:
Instrument: ${trade.instrument}
Direction: ${trade.direction}
Entry: ${trade.entry_price}
Exit: ${trade.exit_price}
PnL: ${trade.pnl}
Session: ${trade.session}
Setup: ${trade.setup_type}
Emotion: ${trade.emotion_tags?.join(", ")}
Notes: ${trade.notes}

Analyze this trade against the strategy. Return a JSON object with:
{
  "overall_compliance": "followed" | "partial" | "violated",
  "compliance_score": 1-10,
  "strengths": ["what was done well"],
  "violations": ["what rules were broken"],
  "suggestions": ["specific improvements"],
  "summary": "2-3 sentence overall assessment"
}`

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }]
  })

  const feedback = JSON.parse(message.content[0].type === "text" 
    ? message.content[0].text : "{}")

  // 5. Save feedback to trade record
  await supabase.from("trades").update({
    ai_feedback: feedback,
    ai_feedback_requested_at: new Date().toISOString()
  }).eq("id", tradeId)

  return Response.json({ feedback })
}
```

---

### Feature 6: Onboarding Quiz

**Complexity:** Easy

**Cursor prompt:**
```
Create an onboarding quiz for Traderpost — shown only on first login.
Using Next.js, Supabase, Tailwind, shadcn/ui.

5 steps with progress bar:
1. "What's your trading experience?" (beginner / intermediate / advanced)
2. "What do you trade?" (multi-select: Futures, Crypto, Forex, Stocks, Options)
3. "What sessions do you trade?" (multi-select: London, NY, Asian, Overnight)
4. "What's your main goal?" (Improve consistency / Track performance / Learn trading / Build income)
5. "Welcome to Traderpost!" (confirmation screen showing their personalized dashboard preview)

Save answers to profiles table (trading_style, experience_level, preferred_instruments).
Set onboarding_complete = true when finished.
Redirect to dashboard after completion.
Skip button available on each step.
Dark theme, animated step transitions.
```

---

## Security Implementation

### Authentication Setup

Supabase handles 95% of auth security automatically. Here's what you configure:

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr"

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

**In Supabase Dashboard, enable:**
- [ ] Email confirmation required (prevents fake accounts)
- [ ] Password minimum 8 characters
- [ ] Rate limit: 5 signup attempts per hour per IP
- [ ] Rate limit: 10 login attempts per hour per IP

### Environment Variables (NEVER commit these)

```bash
# .env.local — add to .gitignore immediately
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Server-side only — NEVER prefix with NEXT_PUBLIC_
ANTHROPIC_API_KEY=your-claude-api-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Security Checklist

- [ ] `.env.local` added to `.gitignore` before first commit
- [ ] Row Level Security enabled on all tables (SQL above handles this)
- [ ] ANTHROPIC_API_KEY only in server-side API routes, never in components
- [ ] Email verification required before posting to community
- [ ] Rate limiting on AI feedback endpoint (max 10 requests/hour per user)
- [ ] Input validation on all form fields before database insert
- [ ] Supabase Storage bucket set to private (signed URLs for screenshots)
- [ ] No console.log statements with user data in production

---

## AI Assistance Strategy

### Which AI Tool for What Task

| Task | Best Tool | Example Prompt Starter |
|---|---|---|
| Planning a feature | Claude (here) | "How should I structure the data for..." |
| Writing components | Cursor | "Create a React component that..." |
| Fixing errors | Cursor | "I'm getting this error: [paste error]" |
| Database queries | Cursor | "Write a Supabase query that fetches..." |
| Styling/UI | Cursor + v0.dev | "Make this component look like..." |
| Understanding code | Claude (here) | "Explain what this code does line by line" |

### Prompt Templates for Traderpost Features

**Starting a new component:**
```
I'm building Traderpost — an all-in-one trading platform.
Tech stack: Next.js 14, TypeScript, Supabase, Tailwind CSS, shadcn/ui.
Dark theme colors: background #0F1923, cards #1E2D3D, accent green #00C896.

Create [component name] that:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

It should connect to Supabase [table name] table.
Follow shadcn/ui patterns for components.
```

**Debugging an error:**
```
I'm building Traderpost with Next.js 14, Supabase, TypeScript.
I'm getting this error: [paste exact error]
In this file: [paste the file content]
I was trying to: [describe what you were doing]
Please fix the error and explain what was wrong.
```

**Understanding code Cursor wrote:**
```
Cursor just wrote this code for me: [paste code]
I'm a CS student learning to code for the first time.
Please explain what each part does in simple terms.
Also tell me: is this the right way to do it? Any improvements?
```

---

## Development Setup — Day by Day

### Day 1: Environment Setup
- [ ] Install VS Code: code.visualstudio.com
- [ ] Install Cursor: cursor.com (sign up for free account)
- [ ] Install Node.js: nodejs.org (LTS version)
- [ ] Create GitHub account: github.com
- [ ] Create Supabase account: supabase.com (no credit card)
- [ ] Create Vercel account: vercel.com (connect GitHub)
- [ ] Create Anthropic account: console.anthropic.com (add $5 credit — will last months)

### Day 2: Project Initialization
```bash
# Run these commands in your terminal (Cursor has a built-in terminal)
npx create-next-app@latest traderpost --typescript --tailwind --app --src-dir
cd traderpost

# Install core dependencies
npm install @supabase/supabase-js @supabase/ssr
npm install @anthropic-ai/sdk
npm install recharts
npm install bad-words

# Install shadcn/ui
npx shadcn@latest init
# Choose: Dark theme, Default style, Yes to CSS variables

# Add shadcn components you'll need
npx shadcn@latest add button card input label select textarea dialog table badge avatar tabs
```

### Day 3: First Deploy
```bash
# Connect to GitHub
git init
git add .
git commit -m "Initial Traderpost setup"
# Create repo on github.com, then:
git remote add origin https://github.com/yourusername/traderpost.git
git push -u origin main
# Go to vercel.com → Import from GitHub → Deploy
# Add environment variables in Vercel dashboard
```

After Day 3: Your app is live at `traderpost.vercel.app` — even if it's just a hello screen. From here, every `git push` auto-deploys.

### Build Order (Days 4–30)

| Days | Feature | Why This Order |
|---|---|---|
| 4–7 | Auth (login, signup, onboarding) | Everything requires a logged-in user |
| 8–13 | Trade Journal | Core feature — all other features depend on trade data |
| 14–18 | Analytics Dashboard | Uses trade data from journal |
| 19–22 | Strategy Builder | Needed before AI feedback |
| 23–25 | AI Trade Feedback | Depends on journal + strategy |
| 26–28 | Community Feed | Independent — build last |
| 29–30 | Polish, testing, bug fixes | Buffer for issues |

---

## Deployment Plan

### Vercel (Recommended — Free)

**Why Vercel:** Push to GitHub → automatically deployed. Zero configuration. Free SSL certificate. Global CDN. Preview deployments for every branch.

**Setup:**
1. Connect GitHub repo to Vercel (one-time)
2. Add environment variables in Vercel dashboard
3. Every `git push main` deploys automatically

**Custom domain (when ready):**
- Buy domain on Namecheap (~$10/year for `.com`)
- Add in Vercel → Settings → Domains
- Done in 5 minutes

### Backup Option: Cloudflare Pages
- Also free, also auto-deploys from GitHub
- Use if Vercel has unexpected limits

---

## Cost Breakdown

### Development Phase (Building — Month 1)
| Service | Free Tier | You Need | Monthly Cost |
|---|---|---|---|
| Vercel | Generous free tier | Free | $0 |
| Supabase | 500MB DB, 1GB storage | Free | $0 |
| Cursor | Free tier available | Free (or $20 Pro) | $0–20 |
| Anthropic API | Pay per use | $5 credit (lasts months) | ~$1 |
| GitHub | Free | Free | $0 |
| Domain (optional) | — | ~$10/year | $0 |
| **Total** | | | **$0–21/mo** |

### Production Phase (After Launch)
| Users | Monthly Cost | What Changes |
|---|---|---|
| 0–100 | $0 | Everything on free tiers |
| 100–500 | $0–5 | Anthropic API usage grows |
| 500–1,000 | $5–20 | Supabase approaching limits |
| 1,000–5,000 | $25–50 | Upgrade Supabase to Pro ($25) |
| 5,000+ | $50–100 | Add Vercel Pro if needed ($20) |

**Cost control rules:**
1. Set Anthropic monthly budget cap to $10 in dashboard
2. Limit free users to 5 AI feedback requests/month
3. Set up Supabase usage alerts at 80% of free tier
4. Never upgrade a service before you have revenue to cover it

---

## Scaling Path

### 100 Users — Current setup handles fine
- Monitor Supabase dashboard for usage
- Gather feedback from real traders
- Fix bugs, improve UX

### 1,000 Users — Minor upgrades
- Upgrade Supabase to Pro ($25/month) for more storage and connections
- Add database indexes (already done in schema above)
- Consider Vercel Pro if bandwidth exceeded

### 10,000 Users — Architecture still holds
- Add Redis caching for analytics (Upstash — free tier)
- Database read replicas in Supabase
- CDN for chart screenshots

### 100,000 Users — You're profitable, hire help
- This is a good problem to have
- Architecture decisions made today still support this scale
- Add engineering help at this point

---

## Important Limitations

### What This Approach CAN'T Do (Yet):
1. **Broker OAuth Sync (V1b):** Connecting to real broker accounts (Tradovate, Interactive Brokers) requires applying for API access, often a lengthy approval process. CSV import is the V1 solution — broker sync is V1b.
   - *Workaround:* CSV import covers 90% of use cases for early users

2. **Real-time Price Data:** Showing live market prices requires paid data feeds ($50–500/month).
   - *Workaround:* Traderpost is a post-trade tool — users log after closing. No live prices needed for V1.

3. **Native Desktop App:** Not a web app limitation, but packaging as Electron/Tauri requires code signing certificates (~$100/year for Windows).
   - *Workaround:* Web app works perfectly. Add "Install to Desktop" PWA button for desktop feel. Electron wrap in V2.

4. **Offline Mode:** Supabase requires internet connection.
   - *Workaround:* Traders are always online. Non-issue for target users.

### When You'll Need to Upgrade:
- **Supabase storage full (1GB):** When screenshots pile up — upgrade to Pro ($25/month)
- **Supabase DB connections maxed:** At ~500 concurrent users — upgrade to Pro
- **Vercel bandwidth limit:** At very high traffic — upgrade to Pro ($20/month)
- **Anthropic costs rising:** Implement caching of AI responses so same trade+strategy combo isn't analyzed twice

---

## Learning Resources

### Your Learning Path for This Stack

**Week 1 — Next.js basics:**
- Next.js official tutorial: nextjs.org/learn (free, interactive)
- YouTube: "Next.js 14 Crash Course" by Traversy Media

**Week 2 — Supabase:**
- Supabase docs: supabase.com/docs/guides/getting-started/quickstarts/nextjs
- YouTube: "Supabase Crash Course" by Traversy Media

**Week 3 — Tailwind + shadcn:**
- Tailwind docs: tailwindcss.com/docs
- shadcn/ui: ui.shadcn.com/docs

**Cursor (AI coding tool):**
- Cursor docs: docs.cursor.com
- YouTube: "Cursor AI Tutorial for Beginners"

### When You Get Stuck

1. **Error you don't understand:** Paste into Cursor chat — it knows the full codebase
2. **Concept you don't understand:** Ask Claude (here) to explain simply
3. **UI component:** Check ui.shadcn.com for pre-built components
4. **Supabase question:** supabase.com/docs is very beginner-friendly
5. **Community:** Supabase Discord, Next.js Discord, r/nextjs

---

## Success Checklist

### Before Starting Development
- [ ] All accounts created (Vercel, Supabase, GitHub, Anthropic, Cursor)
- [ ] `.env.local` in `.gitignore` before first commit
- [ ] "Hello World" deployed to Vercel successfully
- [ ] Supabase project created and database schema applied
- [ ] Budget alerts configured (Anthropic: $10 cap, Supabase: 80% alert)

### During Development
- [ ] Building in order (Auth → Journal → Analytics → Strategy → AI → Community)
- [ ] Testing each feature before moving to next
- [ ] Pushing to GitHub daily (saves your work + auto-deploys)
- [ ] Asking Cursor/Claude when stuck — never spend 2+ hours on one problem alone
- [ ] Checking Supabase dashboard weekly for usage

### Before Launch
- [ ] All P0 features working (Journal, Dashboard, Community Feed)
- [ ] Email verification required for new accounts
- [ ] Rate limiting active on community posts
- [ ] AI API key confirmed server-side only (not in any frontend file)
- [ ] Row Level Security confirmed on all tables
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Tested on mobile browser
- [ ] Error handling on all forms (what happens if Supabase is down?)
- [ ] Beta tested with 3–5 real traders
- [ ] Privacy policy page exists

---

## Definition of Technical Success

Your technical implementation is successful when:
- [ ] App runs without crashing on Chrome, Firefox, and Safari
- [ ] All PRD features work end-to-end
- [ ] Users' trade data is private — no one else can see it
- [ ] Monthly costs stay under $20 until you have revenue
- [ ] You can push an update yourself without breaking anything
- [ ] You understand enough of the codebase to explain what each folder does

---

*Technical Design for: Traderpost MVP*
*Approach: Next.js + Supabase + Vercel + Cursor (AI-assisted vibe coding)*
*Estimated Time to MVP: 30 days at 2–3 hours/day*
*Estimated Cost: $0–21/month during build, $0 at launch*
*Created: March 2026*
*Status: Ready for AGENTS.md (Part 4)*
