create extension if not exists pgcrypto;

create table if not exists public.care_events (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  event_type text not null check (
    event_type in (
      'medication',
      'consultation',
      'deworming',
      'vaccine',
      'custom'
    )
  ),
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  status text not null default 'scheduled' check (
    status in (
      'scheduled',
      'completed',
      'cancelled'
    )
  ),
  reminder_at timestamptz,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists care_events_owner_pet_type_starts_idx
  on public.care_events (owner_id, pet_id, event_type, starts_at desc);

create index if not exists care_events_owner_starts_idx
  on public.care_events (owner_id, starts_at desc);

alter table public.care_events enable row level security;

create policy "Users can view their own care events"
on public.care_events
for select
using (owner_id = auth.uid());

create policy "Users can insert their own care events"
on public.care_events
for insert
with check (owner_id = auth.uid());

create policy "Users can update their own care events"
on public.care_events
for update
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "Users can delete their own care events"
on public.care_events
for delete
using (owner_id = auth.uid());

create or replace function public.set_care_events_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_care_events_updated_at on public.care_events;

create trigger trg_care_events_updated_at
before update on public.care_events
for each row
execute function public.set_care_events_updated_at();
