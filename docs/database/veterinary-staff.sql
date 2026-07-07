create extension if not exists pgcrypto;

create table if not exists public.veterinary_staff (
  id uuid primary key default gen_random_uuid(),
  veterinary_id uuid not null references public.veterinaries(id) on delete cascade,
  photo_url text,
  full_name text not null,
  specialty text,
  university text,
  years_experience integer,
  bio text,
  languages text[],
  schedule_notes text,
  instagram_url text,
  facebook_url text,
  linkedin_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists veterinary_staff_veterinary_idx
  on public.veterinary_staff (veterinary_id, is_active);

alter table public.veterinary_staff enable row level security;

create policy "Authenticated users can view veterinary staff"
on public.veterinary_staff
for select
to authenticated
using (true);

create or replace function public.set_veterinary_staff_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_veterinary_staff_updated_at on public.veterinary_staff;

create trigger trg_veterinary_staff_updated_at
before update on public.veterinary_staff
for each row
execute function public.set_veterinary_staff_updated_at();
