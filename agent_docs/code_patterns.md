# Code Patterns & Conventions

## Architectural Pattern
- Use Next.js App Router for page and route segmentation.
- Keep page-level handlers focused on request/response concerns.
- Move reusable logic into `lib/utils` and feature modules.
- Keep Supabase access centralized in `lib/supabase/client.ts` and `lib/supabase/server.ts`.

## Folder Intent
- `app/(auth)` for login/signup flows.
- `app/(dashboard)` for authenticated product pages.
- `app/api/*` for server-only endpoints (imports, AI feedback, moderation checks).
- `components/*` grouped by product feature.
- `lib/types` for shared domain types and DTOs.

## Type Safety Rules
- No `any`; use explicit interfaces/types.
- Validate external input at boundaries.
- Keep calculation utilities pure and deterministic for easy testing.

## Error Handling Rules
- Return clear HTTP status codes from API routes.
- Do not leak internal errors or secrets to clients.
- Add user-friendly error messages in forms and mutation flows.

## Example: Server Route Guard + Validation
```typescript
type FeedbackRequest = { tradeId: string; strategyId: string };

function isFeedbackRequest(value: unknown): value is FeedbackRequest {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.tradeId === "string" && typeof candidate.strategyId === "string";
}

export async function POST(request: Request) {
  const body: unknown = await request.json();
  if (!isFeedbackRequest(body)) {
    return Response.json({ error: "Invalid request payload" }, { status: 400 });
  }
  return Response.json({ ok: true });
}
```

## Example: Calculation Utility
```typescript
export function calculateWinRate(pnls: number[]): number {
  if (pnls.length === 0) return 0;
  const wins = pnls.filter((value) => value > 0).length;
  return (wins / pnls.length) * 100;
}
```
