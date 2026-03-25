# Testing Strategy

## Frameworks
- **Unit Tests:** Vitest + Testing Library (recommended baseline)
- **E2E Tests:** Playwright
- **Manual Checks:** Browser-based validation of key user flows

## Rules & Requirements
- **Coverage Target:** 80%+ on critical trading flows (journal calculations, auth guards, AI endpoint validation).
- **Before Commit:** Run lint, type check, and relevant tests.
- **Failures:** Never bypass failing checks. Fix, then re-run.
- **Security Verification:** Confirm no server secrets are exposed client-side.

## Command Baseline
- Run all tests: `npm test`
- Run unit tests only: `npm run test:unit` (define script when scaffolded)
- Run e2e only: `npm run test:e2e` (define script when scaffolded)
- Lint: `npm run lint`
- Type check: `npx tsc --noEmit`

## Verification Loop (Per Feature)
1. Implement one small feature slice.
2. Run lint + type check.
3. Run related unit/e2e tests.
4. Manually test the feature in browser.
5. Update `MEMORY.md` with decisions/issues before moving on.

## Priority Manual Test Flows
- Onboarding -> dashboard personalization flow.
- Log trade -> verify computed PnL/RR -> data persistence.
- Analytics updates after new trade.
- Community post appears in real-time for another session.
- AI feedback request returns structured response and stores result.
