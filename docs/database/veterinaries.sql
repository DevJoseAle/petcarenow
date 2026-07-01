create extension if not exists pgcrypto;

create table if not exists public.veterinaries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  city text not null,
  phone text,
  photo_url text,
  latitude numeric not null,
  longitude numeric not null,
  is_emergency boolean not null default false,
  is_24_7 boolean not null default false,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists veterinaries_city_idx
  on public.veterinaries (city);

create index if not exists veterinaries_emergency_idx
  on public.veterinaries (is_emergency, is_24_7);

alter table public.veterinaries enable row level security;

create policy "Authenticated users can view veterinaries"
on public.veterinaries
for select
to authenticated
using (true);

create or replace function public.set_veterinaries_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_veterinaries_updated_at on public.veterinaries;

create trigger trg_veterinaries_updated_at
before update on public.veterinaries
for each row
execute function public.set_veterinaries_updated_at();

insert into public.veterinaries (
  name,
  address,
  city,
  phone,
  photo_url,
  latitude,
  longitude,
  is_emergency,
  is_24_7,
  description
)
values
  (
    'Clinica Veterinaria Santiago Centro',
    'Avenida Libertador Bernardo O''Higgins 1450',
    'Santiago',
    '+56 2 2555 0101',
    'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1200&q=80',
    -33.4475,
    -70.6616,
    true,
    true,
    'Urgencias, hospitalizacion breve y atencion general para perros y gatos.'
  ),
  (
    'Providencia Pet Care',
    'Avenida Providencia 2216',
    'Santiago',
    '+56 2 2666 0222',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80',
    -33.4253,
    -70.6172,
    true,
    false,
    'Consultas medicas, farmacia veterinaria y atencion prioritaria.'
  ),
  (
    'Las Condes Animal Health',
    'Avenida Apoquindo 6410',
    'Santiago',
    '+56 2 2777 0333',
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80',
    -33.4086,
    -70.5674,
    false,
    false,
    'Controles preventivos, vacunacion y medicina interna.'
  )
on conflict do nothing;
