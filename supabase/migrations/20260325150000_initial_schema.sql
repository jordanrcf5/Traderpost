-- Traderpost MVP - Initial Schema
-- Apply in Supabase SQL editor or via Supabase CLI migrations.

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username varchar(50) unique,
  display_name varchar(100),
  avatar_url text,
  bio text,
  trading_style varchar(50),
  experience_level varchar(20),
  preferred_instruments text[],
  onboarding_complete boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create a profile row for each new auth user.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- ============================================================
-- STRATEGIES
-- ============================================================
create table if not exists public.strategies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name varchar(100) not null,
  instruments text[],
  sessions text[],
  entry_rules text,
  exit_rules text,
  risk_rules text,
  invalidation_rules text,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists idx_strategies_user_id on public.strategies(user_id);

-- ============================================================
-- TRADES
-- ============================================================
create table if not exists public.trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  strategy_id uuid references public.strategies(id) on delete set null,
  instrument varchar(50) not null,
  direction varchar(10) not null,
  entry_price decimal(20, 8) not null,
  exit_price decimal(20, 8) not null,
  position_size decimal(20, 8) not null,
  pnl decimal(20, 8),
  risk_reward_ratio decimal(10, 4),
  trade_date timestamp with time zone not null,
  session varchar(20),
  setup_type varchar(100),
  emotion_tags text[],
  rating integer check (rating between 1 and 5),
  notes text,
  screenshot_url text,
  ai_feedback jsonb,
  ai_feedback_requested_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists idx_trades_user_id on public.trades(user_id);
create index if not exists idx_trades_trade_date on public.trades(trade_date);
create index if not exists idx_trades_instrument on public.trades(instrument);
create index if not exists idx_trades_session on public.trades(session);

-- ============================================================
-- COMMUNITY
-- ============================================================
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  trade_id uuid references public.trades(id) on delete set null,
  post_type varchar(20) not null,
  content text not null,
  image_url text,
  tags text[],
  is_flagged boolean default false,
  flag_count integer default 0,
  is_removed boolean default false,
  like_count integer default 0,
  comment_count integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists idx_posts_user_id on public.posts(user_id);
create index if not exists idx_posts_created_at on public.posts(created_at desc);

create table if not exists public.post_likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  unique (post_id, user_id)
);

create table if not exists public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default now()
);

create index if not exists idx_comments_post_id on public.post_comments(post_id);

create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  unique (follower_id, following_id)
);

-- ============================================================
-- RLS
-- ============================================================
alter table public.profiles enable row level security;
alter table public.trades enable row level security;
alter table public.strategies enable row level security;
alter table public.posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_comments enable row level security;
alter table public.follows enable row level security;

drop policy if exists "Users can access own profile" on public.profiles;
create policy "Users can access own profile"
on public.profiles for all
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can only access their own trades" on public.trades;
create policy "Users can only access their own trades"
on public.trades for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can only access their own strategies" on public.strategies;
create policy "Users can only access their own strategies"
on public.strategies for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Posts are publicly readable" on public.posts;
create policy "Posts are publicly readable"
on public.posts for select
using (is_removed = false);

drop policy if exists "Users can create their own posts" on public.posts;
create policy "Users can create their own posts"
on public.posts for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can edit their own posts" on public.posts;
create policy "Users can edit their own posts"
on public.posts for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own posts" on public.posts;
create policy "Users can delete their own posts"
on public.posts for delete
using (auth.uid() = user_id);

drop policy if exists "Users can read likes" on public.post_likes;
create policy "Users can read likes"
on public.post_likes for select
using (true);

drop policy if exists "Users can manage own likes" on public.post_likes;
create policy "Users can manage own likes"
on public.post_likes for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can read comments" on public.post_comments;
create policy "Users can read comments"
on public.post_comments for select
using (true);

drop policy if exists "Users can create own comments" on public.post_comments;
create policy "Users can create own comments"
on public.post_comments for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can edit/delete own comments" on public.post_comments;
create policy "Users can edit/delete own comments"
on public.post_comments for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can read follows" on public.follows;
create policy "Users can read follows"
on public.follows for select
using (true);

drop policy if exists "Users can manage own follows" on public.follows;
create policy "Users can manage own follows"
on public.follows for all
using (auth.uid() = follower_id)
with check (auth.uid() = follower_id);
