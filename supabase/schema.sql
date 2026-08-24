-- (sample) ExpertMatch — MVP 데이터 구조
--
-- 이번 MVP는 데모 목적이므로 애플리케이션은 src/lib/data 의 Mock 데이터와
-- 브라우저 localStorage 로 동작한다. 이 스키마는 동일한 구조를 Supabase 로
-- 옮길 때 그대로 사용할 수 있도록 작성한 참조 정의다.
-- (실행하려면: supabase db execute -f supabase/schema.sql)

create extension if not exists "pgcrypto";

-- 상담 방식
do $$ begin
  create type consult_method as enum ('video', 'phone', 'chat');
exception when duplicate_object then null; end $$;

do $$ begin
  create type booking_status as enum ('upcoming', 'done', 'cancelled');
exception when duplicate_object then null; end $$;

-- 사용자 (Supabase auth.users 와 1:1 로 연결)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid unique,
  name text not null,
  email text unique,
  created_at timestamptz not null default now()
);

-- 상담 분야
create table if not exists public.categories (
  id text primary key,             -- 'startup', 'marketing', ...
  name text not null,
  tagline text,
  icon text,
  sort_order int not null default 0
);

-- 전문가
create table if not exists public.experts (
  id text primary key,             -- 'kim-dohyun'
  name text not null,
  title text not null,
  affiliation text,
  headline text,
  intro text,
  years_of_experience int not null default 0,
  rating numeric(2,1) not null default 0,
  review_count int not null default 0,
  consult_count int not null default 0,
  price_from int not null default 0,
  methods consult_method[] not null default '{}',
  languages text[] not null default '{한국어}',
  response_minutes int not null default 60,
  available_this_week boolean not null default true,
  open_slots int not null default 0,
  strengths text[] not null default '{}',
  badge text,
  accent smallint not null default 0,
  featured_rank int not null default 999,
  created_at timestamptz not null default now()
);

-- 전문가 ↔ 분야 (N:M)
create table if not exists public.expert_categories (
  expert_id text references public.experts(id) on delete cascade,
  category_id text references public.categories(id) on delete cascade,
  is_primary boolean not null default false,
  primary key (expert_id, category_id)
);

-- 검색 키워드 / 세부 역량
create table if not exists public.expert_skills (
  id bigserial primary key,
  expert_id text not null references public.experts(id) on delete cascade,
  skill text not null
);
create index if not exists expert_skills_expert_idx on public.expert_skills(expert_id);

-- 상담 상품
create table if not exists public.consultation_products (
  id text primary key,
  expert_id text not null references public.experts(id) on delete cascade,
  name text not null,
  minutes int not null,
  price int not null,
  description text,
  recommended boolean not null default false,
  sort_order int not null default 0
);
create index if not exists products_expert_idx on public.consultation_products(expert_id);

-- 상담 가능 시간
create table if not exists public.availability (
  id bigserial primary key,
  expert_id text not null references public.experts(id) on delete cascade,
  date date not null,
  time time not null,
  is_booked boolean not null default false,
  unique (expert_id, date, time)
);
create index if not exists availability_expert_date_idx on public.availability(expert_id, date);

-- 예약
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,            -- EM-YYYYMMDD-XXXX
  user_id uuid references public.users(id) on delete set null,
  expert_id text not null references public.experts(id) on delete restrict,
  product_id text not null references public.consultation_products(id) on delete restrict,
  method consult_method not null,
  date date not null,
  time time not null,
  minutes int not null,
  price int not null,
  note text,
  status booking_status not null default 'upcoming',
  created_at timestamptz not null default now()
);
create index if not exists bookings_user_idx on public.bookings(user_id, date desc);
create index if not exists bookings_expert_idx on public.bookings(expert_id, date);

-- 리뷰
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  expert_id text not null references public.experts(id) on delete cascade,
  booking_id uuid unique references public.bookings(id) on delete set null,
  user_id uuid references public.users(id) on delete set null,
  author_label text not null,           -- '이*민' 형태의 마스킹 표기
  rating smallint not null check (rating between 1 and 5),
  body text not null,
  product_name text,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists reviews_expert_idx on public.reviews(expert_id, created_at desc);

-- 찜
create table if not exists public.favorites (
  user_id uuid not null references public.users(id) on delete cascade,
  expert_id text not null references public.experts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, expert_id)
);

-- RLS: 본인 데이터만 접근, 전문가/분야/리뷰는 공개 읽기
alter table public.bookings enable row level security;
alter table public.favorites enable row level security;

create policy if not exists "본인 예약만 조회" on public.bookings
  for select using (auth.uid() = (select auth_id from public.users where id = user_id));
create policy if not exists "본인 예약만 생성" on public.bookings
  for insert with check (auth.uid() = (select auth_id from public.users where id = user_id));
create policy if not exists "본인 찜만 관리" on public.favorites
  for all using (auth.uid() = (select auth_id from public.users where id = user_id));
