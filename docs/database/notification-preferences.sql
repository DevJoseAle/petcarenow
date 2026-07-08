create extension if not exists pgcrypto;

create table if not exists public.notification_preferences (
  owner_id uuid primary key references public.profiles(id) on delete cascade,
  upcoming_care_enabled boolean not null default true,
  medications_enabled boolean not null default true,
  vaccines_enabled boolean not null default true,
  important_alerts_enabled boolean not null default true,
  daily_summary_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.notification_preferences enable row level security;

create policy "Users can view their own notification preferences"
on public.notification_preferences
for select
using (owner_id = auth.uid());

create policy "Users can insert their own notification preferences"
on public.notification_preferences
for insert
with check (owner_id = auth.uid());

create policy "Users can update their own notification preferences"
on public.notification_preferences
for update
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create or replace function public.set_notification_preferences_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_notification_preferences_updated_at on public.notification_preferences;

create trigger trg_notification_preferences_updated_at
before update on public.notification_preferences
for each row
execute function public.set_notification_preferences_updated_at();
