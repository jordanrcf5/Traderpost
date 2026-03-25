# Tech Stack & Tools

- **Frontend:** Next.js 14 (App Router), React, TypeScript
- **Backend:** Next.js API routes + Supabase Edge/server integration
- **Database:** PostgreSQL (Supabase-managed)
- **Styling:** Tailwind CSS + shadcn/ui
- **Authentication:** Supabase Auth (email/password, JWT/session management)
- **Realtime:** Supabase Realtime (community feed updates)
- **File Storage:** Supabase Storage (chart screenshots)
- **Charts:** Recharts
- **AI Feedback:** Anthropic Claude API (Haiku family model)
- **Deployment:** Vercel

## Required Packages
- `@supabase/supabase-js`
- `@supabase/ssr`
- `@anthropic-ai/sdk`
- `recharts`
- `bad-words`

## Setup Commands
```bash
npx create-next-app@latest traderpost --typescript --tailwind --app --src-dir
cd traderpost
npm install @supabase/supabase-js @supabase/ssr
npm install @anthropic-ai/sdk
npm install recharts
npm install bad-words
npx shadcn@latest init
npx shadcn@latest add button card input label select textarea dialog table badge avatar tabs
```

## Environment Variables
```bash
# Public
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Server-side only
ANTHROPIC_API_KEY=your-anthropic-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Error Handling Pattern
```typescript
// Example API route pattern: authenticate first, validate input, return typed errors.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.tradeId) {
      return Response.json({ error: "tradeId is required" }, { status: 400 });
    }

    // ...business logic...
    return Response.json({ ok: true });
  } catch (error) {
    // Keep response safe and generic; details go to server logs only.
    return Response.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
```

## Styling & Component Example
```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card className="bg-[#1E2D3D] border-slate-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-slate-300">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-[#00C896]">{value}</p>
      </CardContent>
    </Card>
  );
}
```
