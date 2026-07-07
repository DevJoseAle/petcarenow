create extension if not exists pgcrypto;

create table if not exists public.veterinary_hours (
  id uuid primary key default gen_random_uuid(),
  veterinary_id uuid not null references public.veterinaries(id) on delete cascade,
  hour_type text not null check (
    hour_type in (
      'general',
      'emergency',
      'holiday',
      'closed_day',
      'home_visit'
    )
  ),
  day_of_week integer check (day_of_week between 0 and 6),
  opens_at time,
  closes_at time,
  notes text,
  is_24_hours boolean not null default false,
  is_closed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists veterinary_hours_veterinary_idx
  on public.veterinary_hours (veterinary_id, hour_type, day_of_week);

alter table public.veterinary_hours enable row level security;

create policy "Authenticated users can view veterinary hours"
on public.veterinary_hours
for select
to authenticated
using (true);

create or replace function public.set_veterinary_hours_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_veterinary_hours_updated_at on public.veterinary_hours;

create trigger trg_veterinary_hours_updated_at
before update on public.veterinary_hours
for each row
execute function public.set_veterinary_hours_updated_at();
