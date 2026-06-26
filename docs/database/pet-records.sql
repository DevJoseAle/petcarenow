create extension if not exists pgcrypto;

create table if not exists public.pet_records (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  record_type text not null check (
    record_type in (
      'weight',
      'symptom',
      'medication',
      'note'
    )
  ),
  recorded_at timestamptz not null,
  description text not null,
  value_numeric numeric,
  value_unit text,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pet_records_owner_pet_recorded_idx
  on public.pet_records (owner_id, pet_id, recorded_at desc);

create index if not exists pet_records_owner_type_recorded_idx
  on public.pet_records (owner_id, record_type, recorded_at desc);

alter table public.pet_records enable row level security;

create policy "Users can view their own pet records"
on public.pet_records
for select
using (owner_id = auth.uid());

create policy "Users can insert their own pet records"
on public.pet_records
for insert
with check (owner_id = auth.uid());

create policy "Users can update their own pet records"
on public.pet_records
for update
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "Users can delete their own pet records"
on public.pet_records
for delete
using (owner_id = auth.uid());

create or replace function public.set_pet_records_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_pet_records_updated_at on public.pet_records;

create trigger trg_pet_records_updated_at
before update on public.pet_records
for each row
execute function public.set_pet_records_updated_at();
