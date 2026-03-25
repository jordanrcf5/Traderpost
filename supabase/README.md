# Supabase Setup

## Apply the initial schema

Use one of the following:

1. **Supabase SQL Editor**
   - Open your Supabase project.
   - Open SQL Editor.
   - Run `supabase/migrations/20260325150000_initial_schema.sql`.
   - Run `supabase/migrations/20260326120000_trade_screenshots_storage.sql` (private `trade-screenshots` bucket + RLS).

2. **Supabase CLI**
   - Link your project.
   - Run migrations with `supabase db push`.

## Auth settings to configure

- Enable email confirmation.
- Set minimum password length to 8+.
- Set signup/login rate limits per your security checklist.

## Required environment variables

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- `ANTHROPIC_API_KEY` (server-only)

## Trade chart screenshots

- Bucket: `trade-screenshots` (private).
- Object paths must be `{your-user-uuid}/{filename}` so Storage RLS matches `auth.uid()`.
- The app stores the **object path** (not a public URL) in `trades.screenshot_url` and uses **signed URLs** to display images in the journal list.
