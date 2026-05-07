-- Fleeting — Supabase Database Schema
-- Run this in your Supabase SQL Editor at supabase.com

-- Businesses table
create table businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  category text not null,
  address text not null,
  city text not null,
  image_url text,
  stripe_account_id text,
  created_at timestamptz default now()
);

-- Deals table
create table deals (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  original_price numeric not null,
  discount_pct integer not null check (discount_pct between 5 and 90),
  spots_total integer not null,
  spots_remaining integer not null,
  image_url text,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

-- Bookings table
create table bookings (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid references deals(id),
  user_id uuid references auth.users(id),
  quantity integer not null default 1,
  amount_paid numeric not null,
  platform_fee numeric not null,
  stripe_session_id text,
  created_at timestamptz default now()
);

-- Row Level Security
alter table businesses enable row level security;
alter table deals enable row level security;
alter table bookings enable row level security;

-- Policies: anyone can read deals
create policy "Public deals are viewable by everyone"
  on deals for select using (expires_at > now() and spots_remaining > 0);

-- Policies: businesses can manage their own deals
create policy "Business owners can insert deals"
  on deals for insert with check (
    business_id in (select id from businesses where user_id = auth.uid())
  );

create policy "Business owners can update their deals"
  on deals for update using (
    business_id in (select id from businesses where user_id = auth.uid())
  );

-- Policies: users can read their own bookings
create policy "Users can view their own bookings"
  on bookings for select using (user_id = auth.uid());

-- Function to decrement spots when a booking is made
create or replace function decrement_spots(deal_id uuid, qty integer)
returns void language plpgsql security definer as $$
begin
  update deals
  set spots_remaining = spots_remaining - qty
  where id = deal_id and spots_remaining >= qty;

  if not found then
    raise exception 'Not enough spots available';
  end if;
end;
$$;
