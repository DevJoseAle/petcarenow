create extension if not exists pgcrypto;

create table if not exists public.notification_devices (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  expo_push_token text not null,
  platform text not null check (
    platform in ('ios', 'android', 'web')
  ),
  device_name text,
  is_active boolean not null default true,
  last_registered_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists notification_devices_owner_platform_token_idx
  on public.notification_devices (owner_id, platform, expo_push_token);

create index if not exists notification_devices_owner_active_idx
  on public.notification_devices (owner_id, is_active, last_registered_at desc);

alter table public.notification_devices enable row level security;

create policy "Users can view their own notification devices"
on public.notification_devices
for select
using (owner_id = auth.uid());

create policy "Users can insert their own notification devices"
on public.notification_devices
for insert
with check (owner_id = auth.uid());

create policy "Users can update their own notification devices"
on public.notification_devices
for update
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create or replace function public.set_notification_devices_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_notification_devices_updated_at on public.notification_devices;

create trigger trg_notification_devices_updated_at
before update on public.notification_devices
for each row
execute function public.set_notification_devices_updated_at();
