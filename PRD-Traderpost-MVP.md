# Product Requirements Document: Traderpost MVP

## Product Overview

**App Name:** Traderpost
**Tagline:** Your entire trading life, one platform.
**Launch Goal:** First paying users — prove people will pay for an all-in-one trading ecosystem
**Target Launch:** Within 30 days of development start

## Who It's For

### Primary User: The Serious Trader
A trader who takes trading seriously — whether full-time, trading around a job, or actively learning. They want professional tools but hate paying for 4–6 separate apps and constantly switching between them.

**Their Current Pain:**
- Managing separate apps for journaling, analytics, community, and charting
- Paying multiple subscriptions ($30–50/month each)
- Losing focus constantly switching between platforms

**What They Need:**
- One login, one dashboard, all tools in one place
- A journal to track and reflect on every trade
- Analytics that show real patterns in their performance
- A community to learn from and connect with other traders

### Example User Story
"Meet Marcus, a part-time trader who works a 9–5 and trades the NY session on his lunch break and after work. He uses Tradezella for journaling, a Discord server for trade ideas, TradingView for charts, and a spreadsheet for stats. Every evening he copies data between apps and loses 30 minutes just getting organized. He needs one place that does all of this so he can spend that time actually improving his trading."

## The Problem We're Solving

Traders today cobble together 4–6 different tools just to operate — a journaling app, a stats spreadsheet, Discord for community, Twitter for trade ideas, ForexFactory for news, and TradingView for charts. Each tool has its own subscription, login, and learning curve. The context-switching breaks focus — the most important mental state when trading.

**Why Existing Solutions Fall Short:**
- **TraderSync / Tradezella / Stonk Journal:** Journal and analytics only — no community, no AI feedback
- **Discord / Twitter:** Community only — no journaling, no analytics, no structured trade data
- **TradingView:** Charts only — no journal, no community feed, no performance tracking

## User Journey

### Discovery → First Use → Success

1. **Discovery Phase**
   - How they find us: trading communities, Reddit, Twitter/X, word of mouth
   - What catches their attention: "Everything in one app" messaging
   - Decision trigger: tired of paying for multiple subscriptions

2. **Onboarding (First 5 Minutes)**
   - Land on: personalized onboarding quiz (trading style, instruments, experience level, goals)
   - First action: answer 5 quick questions to configure their dashboard
   - Quick win: dashboard loads pre-configured to their trading style

3. **Core Usage Loop**
   - Trigger: they take a trade → open Traderpost to log it
   - Action: fill in journal entry, link to their saved strategy
   - Reward: AI feedback on whether they followed their plan + stats update instantly
   - Investment: the more trades they log, the more valuable their analytics become

4. **Success Moment**
   - "Aha!" moment: seeing all their tools in one place for the first time after onboarding
   - Share trigger: posting a trade recap to the community feed and getting engagement

## MVP Features

### Must Have for Launch

#### 1. Trade Journal
- **What:** A structured trade logging system where users record every trade with detailed fields
- **User Story:** As a trader, I want to log every trade with full context so that I can review, reflect, and improve my performance over time
- **Entry Fields:**
  - Instrument (NQ, ES, BTC, EUR/USD, stocks, etc.)
  - Trade direction (Long / Short)
  - Entry price, exit price, position size
  - PnL (auto-calculated)
  - Risk:Reward ratio (auto-calculated)
  - Date and time
  - Setup type (FVG, OB, BOS, etc.)
  - Trading session (London, NY, Asian, Overnight)
  - Strategy used (linked to saved strategy)
  - Emotion tags (Focused, FOMO, Revenge, Patient, etc.)
  - Trade rating (1–5 stars — did I follow my plan?)
  - Notes (free text)
  - Chart screenshot (image upload)
- **Import Options:** Manual entry, CSV file upload, broker account OAuth sync (stretch goal — CSV is fallback)
- **Success Criteria:**
  - [ ] User can log a complete trade in under 60 seconds
  - [ ] CSV import maps columns correctly with preview before saving
  - [ ] Screenshots attach and display inside the entry
  - [ ] All data persists between sessions
  - [ ] Data is encrypted at rest and only accessible by the account owner
- **Priority:** P0 (Critical)

#### 2. Analytics Dashboard
- **What:** A visual command center that transforms logged trade data into actionable performance insights
- **User Story:** As a trader, I want to see my performance stats in one place so that I can identify patterns and improve my trading
- **Metrics Displayed:**
  - Total PnL (cumulative)
  - Win rate (%)
  - Average Risk:Reward ratio
  - Profit factor
  - Max drawdown
  - Best and worst trade
  - PnL equity curve (line chart)
  - Performance by session (bar chart)
  - Performance by setup type (bar chart)
  - Performance by day of week
  - Emotion vs performance correlation
  - Win/loss streak tracker
- **Success Criteria:**
  - [ ] Dashboard loads with correct data within 2 seconds
  - [ ] All charts update in real time when a new trade is logged
  - [ ] User can filter by date range, instrument, or session
  - [ ] Dashboard adapts to the user's onboarding preferences
- **Priority:** P0 (Critical)

#### 3. Community Feed
- **What:** A Twitter/Discord-style social feed where traders share ideas, journal recaps, setups, and insights
- **User Story:** As a trader, I want to share my trades and ideas with a community so that I can learn from others and stay accountable
- **Post Types:**
  - Trade recap (completed trade with outcome and notes)
  - Setup alert (trade idea forming)
  - Journal entry share (share a journal entry publicly)
  - General post (text/image — questions, commentary, education)
- **Interactions:** Like, comment, follow other traders
- **Safety:** Email verification before posting, rate limiting, profanity filter, report system, bot/spam prevention
- **Success Criteria:**
  - [ ] Users can post, like, comment, and follow within the app
  - [ ] Feed loads in under 2 seconds
  - [ ] New posts appear in real time without page refresh
  - [ ] Spam/bot prevention active from day one
  - [ ] Reported posts are queued for moderation review
- **Priority:** P0 (Critical)

#### 4. Strategy Builder
- **What:** A structured form where users define and save their trading rules in plain text — used by the AI feedback system
- **User Story:** As a trader, I want to save my trading strategy rules so that I can evaluate every trade against my own plan
- **Strategy Fields:**
  - Strategy name
  - Instruments traded
  - Trading sessions
  - Entry rules
  - Exit rules
  - Risk rules (max % per trade, max trades per day)
  - Invalidation conditions
- **Success Criteria:**
  - [ ] User can create, save, edit, and delete strategies
  - [ ] Strategies persist between sessions
  - [ ] Strategy can be linked to a journal entry at time of logging
  - [ ] Multiple strategies can be saved (for different markets or styles)
- **Priority:** P1 (High)

#### 5. AI Trade Feedback
- **What:** After a trade is logged and linked to a strategy, AI analyzes the journal entry and gives structured feedback on execution quality
- **User Story:** As a trader, I want AI to review my trades against my strategy so that I can objectively see where I followed my plan and where I didn't
- **How it works:**
  1. User logs a trade and links it to a saved strategy
  2. User requests AI feedback (or triggers automatically on save)
  3. AI compares trade details against saved strategy rules
  4. AI returns structured feedback: what was followed, what was violated, suggestions for improvement
- **Sample Output Categories:** Strategy compliance, entry quality, risk management, session adherence, improvement suggestions
- **Success Criteria:**
  - [ ] AI feedback generates within 10 seconds of request
  - [ ] Feedback references specific strategy rules by name
  - [ ] Feedback is specific to the trade data — not generic
  - [ ] AI API key stored securely server-side, never exposed to client
- **Priority:** P1 (High — late V1 addition, cut to V1b if timeline is at risk)

### NOT in MVP (Saving for V2)

| Feature | Reason for Waiting |
|---|---|
| Backtester | Requires chart data + simulation engine — significant complexity |
| Trading Tracker | Overlaps with V1 analytics — expand after user feedback |
| Prop Firm Tools | Needs clearer feature definition from user research |
| Mobile App | Desktop validated first, then port to mobile |
| Algo Strategy Builder | Different technical requirement, different user need |
| TradingView-style Charts | Major undertaking — north star long-term feature |
| Full Broker OAuth Sync | CSV import is V1 fallback; OAuth moves to V1b |

*Why we're waiting: Keeps MVP focused and shippable within 30 days.*

## How We'll Know It's Working

### Launch Success Metrics (First 30 Days)

| Metric | Target | Measure |
|---|---|---|
| Trades logged per week | 50+ trades/week total | Database query on journal entries |
| Weekly active users | 20+ WAU | Users who open app 2+ days/week |

### Growth Metrics (Months 2–3)

| Metric | Target | Measure |
|---|---|---|
| Trades logged per week | 200+ trades/week | Same as above |
| Weekly active users | 100+ WAU | Same as above |
| Community posts per week | 30+ posts | Post count query |
| AI feedback requests | 20+ per week | API call logs |
| First revenue | 1 paying user within 60 days | Stripe/LemonSqueezy dashboard |

*Note: Signups alone are NOT a success metric — they are a vanity metric. Only engagement (trades logged, active usage) proves real value.*

## Look & Feel

**Design Vibe:** Focused. Professional. Clean confidence. Locked in.

**Visual Principles:**
1. **Dark by default** — Dark background, light text. Easy on eyes during long trading sessions.
2. **Data-forward** — Numbers and charts are the heroes. Never buried or hard to find.
3. **Breathing room** — Enough whitespace that dense data doesn't feel overwhelming.
4. **Green accent** — Green for positive PnL and key actions. The trader's color.
5. **No distractions** — No ads, no unnecessary animations, no bloat.

**Reference aesthetic:** Bloomberg Terminal meets modern SaaS — serious without being intimidating.

**Key Screens:**
1. **Onboarding Quiz** — 5-step personalization flow on first launch
2. **Dashboard (Home)** — PnL summary, recent trades, feed preview, quick-log button
3. **Trade Journal** — Trade list, filters, log new trade, entry detail view
4. **Analytics** — Charts, date range filters, metric cards
5. **Community Feed** — Post feed, compose box, trending tags, follow suggestions
6. **Strategy Builder** — Strategy list, create/edit form
7. **Settings** — Profile, security, broker connections, preferences

### Simple Dashboard Wireframe
```
┌─────────────────────────────────────────────────────┐
│  TRADERPOST          [Journal] [Analytics] [Feed]   │
├──────────────┬──────────────────────────────────────┤
│              │   Today's PnL: +$342    Win: 3/4     │
│   NAV        │                                      │
│              │   [PnL Equity Curve Chart]           │
│   Dashboard  │                                      │
│   Journal    ├──────────────────────────────────────┤
│   Analytics  │   Recent Trades          Community   │
│   Community  │   NQ  +$210  ✓           [Post...]   │
│   Strategy   │   ES  -$45   ✗           [Post...]   │
│   Settings   │   BTC +$177  ✓           [Post...]   │
└──────────────┴──────────────────────────────────────┘
```

## Technical Considerations

**Platform:** Desktop app (Windows + macOS) → Mobile in V2
**Security/Privacy:** High priority — users trust us with financial data and broker credentials
**Performance:** Dashboard loads < 2 seconds, AI feedback < 10 seconds
**Accessibility:** WCAG 2.1 AA minimum
**Scalability:** Architecture should support 10x user growth without rewrite

### Security Requirements (All P0)
- Passwords hashed with bcrypt or Argon2 — never stored in plain text
- JWT authentication with token expiry and refresh rotation
- Broker connections via OAuth 2.0 only — never store broker credentials directly
- AES-256 encryption for sensitive user data at rest
- TLS 1.2+ for all API communication (HTTPS enforced)
- Input sanitization on all user-facing fields (prevent XSS, SQL injection)
- Rate limiting on API and community posting endpoints
- Email verification + CAPTCHA on signup (bot prevention)
- Audit logs for auth events (login, password change, broker connect)

## Quality Standards

**What Traderpost Will NOT Accept:**
- Placeholder content ("Lorem ipsum", sample data) in production
- Half-built features — everything listed works completely or it doesn't ship
- Skipping security requirements to save time
- Ignoring desktop testing on both Windows and macOS before launch

*These standards will be enforced throughout development.*

## Budget & Constraints

**Development Budget:** Near zero — free tiers only at launch
**Monthly Operating:** $0 target at launch, grows as revenue grows
**Timeline:** 30 days to publishable V1
**Team:** Solo — Jordan, vibe coding with AI assistance (first vibe coding project)
**Monetization Plan:** Freemium — free tier with limits, Pro tier at ~$12–15/month via LemonSqueezy or Stripe

## Open Questions & Assumptions

**Open Questions:**
- Which AI API for trade feedback — Claude, OpenAI, or Gemini? (cost per request matters at free tier)
- Which broker(s) to prioritize for OAuth sync in V1b — Tradovate, Alpaca, Interactive Brokers?
- What exact features are locked behind the paid tier vs free?
- Will the community feed be publicly viewable or require an account?

**Key Assumptions:**
- Traders will accept a desktop app before mobile is available
- CSV import is sufficient for early adopters while broker OAuth is being built
- AI trade feedback is a meaningful differentiator vs existing competitors
- Community feed improves week-over-week retention

## Launch Strategy

**Soft Launch:** Share in trading communities — Reddit (r/Forex, r/Daytrading, r/Futures), Twitter/X trading community, Discord servers
**Beta Target:** 3–5 real traders testing before public launch
**Feedback Plan:** In-app feedback button, direct DMs to early users
**Iteration Cycle:** Weekly updates based on user feedback post-launch

## Definition of Done for MVP

The MVP is ready to launch when:
- [ ] All P0 features are fully functional (Journal, Dashboard, Community Feed)
- [ ] P1 features complete or explicitly deferred to V1b (Strategy Builder, AI Feedback)
- [ ] Security checklist fully implemented — no exceptions
- [ ] App installs and runs clean on Windows and macOS
- [ ] End-to-end user journey works without errors (onboard → log trade → see stats → post to feed)
- [ ] Basic error handling — no crashes on bad input
- [ ] Analytics tracking configured (WAU and trades logged)
- [ ] Beta tested with 3–5 real traders
- [ ] Privacy policy and terms of service exist

## Next Steps

After this PRD is approved:
1. Complete Part 1 deep research (validate tech stack, competitors, security approach)
2. Create Technical Design Document (Part 3) — exact stack, DB schema, API architecture
3. Set up development environment with chosen AI coding assistant
4. Build MVP feature by feature — Journal first, then Dashboard, then Community Feed
5. Beta test with real traders
6. Launch!

---
*Document created: March 2026*
*Status: Draft — Ready for Technical Design*
*Project: Traderpost MVP*
