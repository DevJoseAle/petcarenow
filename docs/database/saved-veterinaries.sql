create extension if not exists pgcrypto;

create table if not exists public.saved_veterinaries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  veterinary_id uuid not null references public.veterinaries(id) on delete cascade,
  pet_id uuid references public.pets(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (owner_id, veterinary_id)
);

create index if not exists saved_veterinaries_owner_idx
  on public.saved_veterinaries (owner_id, created_at desc);

alter table public.saved_veterinaries enable row level security;

create policy "Users can view their saved veterinaries"
on public.saved_veterinaries
for select
using (owner_id = auth.uid());

create policy "Users can insert their saved veterinaries"
on public.saved_veterinaries
for insert
with check (owner_id = auth.uid());

create policy "Users can delete their saved veterinaries"
on public.saved_veterinaries
for delete
using (owner_id = auth.uid());
