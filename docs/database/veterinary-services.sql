create extension if not exists pgcrypto;

create table if not exists public.veterinary_services (
  id uuid primary key default gen_random_uuid(),
  veterinary_id uuid not null references public.veterinaries(id) on delete cascade,
  name text not null,
  description text,
  duration_minutes integer,
  price_amount numeric,
  currency text,
  image_url text,
  category_code text not null references public.veterinary_service_categories(code),
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists veterinary_services_veterinary_idx
  on public.veterinary_services (veterinary_id, category_code);

alter table public.veterinary_services enable row level security;

create policy "Authenticated users can view veterinary services"
on public.veterinary_services
for select
to authenticated
using (true);

create or replace function public.set_veterinary_services_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_veterinary_services_updated_at on public.veterinary_services;

create trigger trg_veterinary_services_updated_at
before update on public.veterinary_services
for each row
execute function public.set_veterinary_services_updated_at();
