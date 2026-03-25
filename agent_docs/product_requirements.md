# Product Requirements

## Product
- **Name:** Traderpost
- **One-line description:** Your entire trading life, one platform.
- **Launch goal:** First paying users and proof that traders pay for an all-in-one ecosystem.
- **Timeline:** 30 days to publishable V1.

## Primary User Story
As a serious trader, I want one dashboard for journaling, analytics, and community so I can improve performance without juggling multiple tools.

## Must-Have Features (MVP Launch)
1. **Trade Journal (P0)**
   - Structured logging with instrument, direction, entry/exit, size, PnL, RR, setup type, session, strategy link, emotion tags, notes, screenshot.
   - Manual entry + CSV import fallback.
2. **Analytics Dashboard (P0)**
   - Total PnL, win rate, avg RR, profit factor, max drawdown, best/worst trade.
   - Equity curve and grouped performance charts.
   - Real-time updates when trades are logged.
3. **Community Feed (P0)**
   - Post recap/setup/general content.
   - Like, comment, follow interactions.
   - Safety controls: verification, rate limits, moderation/reporting.

## High-Priority Additions (V1 / V1b)
4. **Strategy Builder (P1)**
   - Create/edit/delete structured strategy rules.
   - Link strategy to trades.
5. **AI Trade Feedback (P1)**
   - Compare logged trades with strategy rules.
   - Return structured compliance feedback within ~10 seconds.
   - Defer to V1b if schedule risk increases.

## Not in MVP
- Backtester
- Expanded Trading Tracker
- Prop Firm tools
- Native mobile app
- Algo strategy builder
- TradingView-style advanced charting
- Full broker OAuth sync (CSV first)

## Success Metrics
### First 30 Days
- 50+ trades logged per week
- 20+ weekly active users

### Months 2-3
- 200+ trades logged per week
- 100+ weekly active users
- 30+ community posts per week
- 20+ AI feedback requests per week
- First paying user within 60 days

## UX/Design Requirements
- Dark mode by default.
- Professional, focused, clean interface.
- Data-forward hierarchy (charts and metrics clearly visible).
- Green accent for positive PnL and key actions.
- Minimal distraction/no bloat.

## Security and Constraints
- Password hashing (bcrypt/Argon2), JWT handling, TLS enforced.
- Sensitive data encryption at rest.
- Input sanitization and API rate limiting.
- Email verification and anti-bot controls.
- Zero/near-zero launch cost target (free tiers first).
- Solo build with AI assistance.
