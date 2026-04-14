create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  stack text not null default '',
  status text not null default 'Planned',
  summary text not null default '',
  details text not null default '',
  demo_url text,
  repo_url text,
  local_only_note text,
  sort_order integer not null default 999,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_sort_order_idx
  on public.projects (sort_order);

create index if not exists projects_is_published_idx
  on public.projects (is_published);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

alter table public.projects enable row level security;

drop policy if exists "Public read published projects" on public.projects;
create policy "Public read published projects"
on public.projects
for select
using (is_published = true);
