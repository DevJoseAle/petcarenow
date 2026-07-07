create extension if not exists pgcrypto;

create table if not exists public.veterinaries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  city text not null,
  phone text,
  email text,
  website_url text,
  whatsapp_phone text,
  instagram_url text,
  facebook_url text,
  tiktok_url text,
  photo_url text,
  logo_url text,
  cover_url text,
  latitude numeric not null,
  longitude numeric not null,
  is_emergency boolean not null default false,
  is_24_7 boolean not null default false,
  description text,
  years_experience integer,
  mission text,
  values text,
  languages text[],
  parking_available boolean not null default false,
  accessibility_features text,
  accepts_insurance boolean not null default false,
  payment_methods text[],
  offers_home_visit boolean not null default false,
  home_visit_notes text,
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
  email,
  website_url,
  whatsapp_phone,
  instagram_url,
  facebook_url,
  photo_url,
  logo_url,
  cover_url,
  latitude,
  longitude,
  is_emergency,
  is_24_7,
  description,
  years_experience,
  mission,
  values,
  languages,
  parking_available,
  accessibility_features,
  accepts_insurance,
  payment_methods,
  offers_home_visit,
  home_visit_notes
)
values
  (
    'Clinica Veterinaria Santiago Centro',
    'Avenida Libertador Bernardo O''Higgins 1450',
    'Santiago',
    '+56 2 2555 0101',
    'contacto@santiagocentrovet.cl',
    'https://santiagocentrovet.cl',
    '+56 9 2555 0101',
    'https://instagram.com/santiagocentrovet',
    'https://facebook.com/santiagocentrovet',
    'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1600&q=80',
    -33.4475,
    -70.6616,
    true,
    true,
    'Urgencias, hospitalizacion breve y atencion general para perros y gatos.',
    12,
    'Cuidar mascotas con criterio clinico y cercania humana.',
    'Confianza, calidez, respuesta rapida y seguimiento responsable.',
    array['Español', 'English'],
    true,
    'Ingreso accesible y apoyo para movilidad reducida.',
    false,
    array['Tarjeta', 'Transferencia', 'Efectivo'],
    true,
    'Atencion a domicilio en comunas centrales previa coordinacion.'
  ),
  (
    'Providencia Pet Care',
    'Avenida Providencia 2216',
    'Santiago',
    '+56 2 2666 0222',
    'hola@providenciapetcare.cl',
    'https://providenciapetcare.cl',
    '+56 9 2666 0222',
    'https://instagram.com/providenciapetcare',
    'https://facebook.com/providenciapetcare',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1600&q=80',
    -33.4253,
    -70.6172,
    true,
    false,
    'Consultas medicas, farmacia veterinaria y atencion prioritaria.',
    9,
    'Acercar medicina veterinaria moderna y clara a cada familia.',
    'Empatia, precision clinica y acompañamiento continuo.',
    array['Español'],
    true,
    'Acceso nivel calle y ascensor.',
    false,
    array['Tarjeta', 'Transferencia'],
    true,
    'Visitas domiciliarias en Providencia, Ñuñoa y Las Condes.'
  ),
  (
    'Las Condes Animal Health',
    'Avenida Apoquindo 6410',
    'Santiago',
    '+56 2 2777 0333',
    'contacto@animalhealth.cl',
    'https://animalhealth.cl',
    '+56 9 2777 0333',
    'https://instagram.com/animalhealthcl',
    'https://facebook.com/animalhealthcl',
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1600&q=80',
    -33.4086,
    -70.5674,
    false,
    false,
    'Controles preventivos, vacunacion y medicina interna.',
    15,
    'Prevenir y tratar con excelencia medica y trato cercano.',
    'Respeto, mejora continua y bienestar animal.',
    array['Español', 'Português'],
    true,
    'Estacionamiento y rampa de acceso.',
    false,
    array['Tarjeta', 'Efectivo'],
    false,
    null
  )
on conflict do nothing;
