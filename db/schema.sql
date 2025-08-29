-- PostgreSQL schema for MVP
-- Latest stable Postgres recommended (e.g., 16.x)

create extension if not exists "uuid-ossp";

-- Users and auth
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text unique not null,
  email text unique,
  preferred_language text not null default 'en', -- 'en' | 'ur'
  created_at timestamptz not null default now()
);

create table if not exists addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  label text not null,
  line1 text not null,
  line2 text,
  city text not null,
  lat double precision not null,
  lng double precision not null,
  is_default boolean not null default false
);

-- Merchants & KYC
create table if not exists merchants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text unique not null,
  address text not null,
  service_radius_km numeric(6,2) not null default 5.0,
  status text not null default 'pending', -- pending | approved | rejected | suspended
  created_at timestamptz not null default now()
);

create table if not exists merchant_docs (
  id uuid primary key default uuid_generate_v4(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  cnic_image_url text not null,
  selfie_image_url text not null,
  business_name text,
  store_address text,
  submitted_at timestamptz not null default now(),
  reviewed_by uuid, -- admin user id if you have admin users table later
  reviewed_at timestamptz,
  decision text -- approve|reject
);

-- Catalog
create table if not exists catalog_items (
  id uuid primary key default uuid_generate_v4(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  name text not null,
  unit text not null, -- kg|g|L|mL|item|dozen
  price_per_unit numeric(12,2) not null,
  in_stock boolean not null default true,
  created_at timestamptz not null default now()
);

-- Grocery Lists
create table if not exists grocery_lists (
  id uuid primary key default uuid_generate_v4(),
  created_by uuid not null references users(id) on delete cascade,
  title text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists grocery_list_items (
  id uuid primary key default uuid_generate_v4(),
  list_id uuid not null references grocery_lists(id) on delete cascade,
  name text not null,
  qty numeric(14,3) not null,
  unit text not null, -- kg|g|L|mL|items|dozen
  notes text
);

-- Quotes
create table if not exists quotes (
  id uuid primary key default uuid_generate_v4(),
  list_id uuid not null references grocery_lists(id) on delete cascade,
  merchant_id uuid not null references merchants(id) on delete cascade,
  delivery_fee numeric(12,2) not null default 0,
  eta_minutes int not null,
  total numeric(12,2) not null,
  status text not null default 'pending', -- pending|sent|accepted|declined|expired
  created_at timestamptz not null default now()
);

create table if not exists quote_lines (
  id uuid primary key default uuid_generate_v4(),
  quote_id uuid not null references quotes(id) on delete cascade,
  name text not null,
  qty numeric(14,3) not null,
  unit text not null,
  price numeric(12,2) not null,
  substitution_of text
);

-- Orders
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  quote_id uuid not null unique references quotes(id) on delete restrict,
  user_id uuid not null references users(id) on delete restrict,
  merchant_id uuid not null references merchants(id) on delete restrict,
  address_id uuid references addresses(id) on delete set null,
  status text not null default 'preparing', -- preparing|out_for_delivery|delivered|cancelled
  total numeric(12,2) not null,
  created_at timestamptz not null default now()
);

-- Deliveries (minimal for MVP; can be merged with orders)
create table if not exists deliveries (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  provider text, -- own|third_party_name
  tracking_link text,
  proof_image_url text,
  delivered_at timestamptz
);

-- Reviews (verified orders only)
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null unique references orders(id) on delete cascade,
  merchant_id uuid not null references merchants(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  tags text[],
  created_at timestamptz not null default now(),
  hidden boolean not null default false
);

-- Disputes
create table if not exists disputes (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  reason text not null,
  details text,
  status text not null default 'open', -- open|resolved
  resolution text, -- refund_recommended|merchant_warning|dismissed
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

-- Audit logs (minimal)
create table if not exists audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid,
  actor_type text not null, -- user|merchant|admin|system
  action text not null,
  target_type text,
  target_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- Indices
create index if not exists idx_merchants_status on merchants(status);
create index if not exists idx_quotes_list on quotes(list_id);
create index if not exists idx_quotes_merchant on quotes(merchant_id);
create index if not exists idx_orders_user on orders(user_id);
create index if not exists idx_orders_merchant on orders(merchant_id);
create index if not exists idx_reviews_merchant_created on reviews(merchant_id, created_at);

-- Ratings support: view for last 90 days reviews per merchant
create or replace view merchant_reviews_90d as
select r.merchant_id,
       count(*) as reviews_count,
       avg(rating)::numeric(3,2) as avg_rating,
       min(created_at) as first_review_at,
       max(created_at) as last_review_at
from reviews r
where r.hidden = false
  and r.created_at >= now() - interval '90 days'
group by r.merchant_id;

