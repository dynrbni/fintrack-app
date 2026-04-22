create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  preferred_currency text not null default 'IDR',
  created_at timestamptz not null default now()
);

create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  institution text not null default 'Bank',
  balance numeric(14,2) not null default 0,
  color text not null default '#3625CD',
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  wallet_id uuid references public.wallets(id) on delete set null,
  merchant text not null,
  category text not null,
  direction text not null check (direction in ('income', 'expense')),
  amount numeric(14,2) not null,
  note text,
  source text not null default 'Supabase',
  reference_id text,
  occurred_at timestamptz not null default now(),
  from_email boolean not null default false,
  email_subject text,
  email_sender text,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create unique index if not exists transactions_reference_id_key on public.transactions(reference_id) where reference_id is not null;

create table if not exists public.parsed_emails (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  sender text not null,
  received_at timestamptz not null default now(),
  parse_status text not null default 'parsed',
  merchant text not null,
  category text not null,
  direction text not null check (direction in ('income', 'expense')),
  amount numeric(14,2) not null,
  confidence numeric(4,3) not null default 0,
  preview text not null default '',
  raw_body text not null,
  linked_transaction_id uuid references public.transactions(id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'avatar_url')
  on conflict (id) do update
    set full_name = excluded.full_name,
        avatar_url = excluded.avatar_url;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.wallets enable row level security;
alter table public.transactions enable row level security;
alter table public.parsed_emails enable row level security;

create policy "Profiles are readable by owner" on public.profiles
  for select using (auth.uid() = id);

create policy "Profiles are editable by owner" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Wallets belong to owner" on public.wallets
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Transactions belong to owner" on public.transactions
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Parsed emails belong to owner" on public.parsed_emails
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);