-- ============================================================================
-- hair up — 사이트 자산 레지스트리
-- ----------------------------------------------------------------------------
-- 코드에서는 파일 경로 대신 asset key 로만 참조한다.
--   예) asset('hero.background.video')  →  https://<project>.supabase.co/storage/v1/object/public/videos/01-hero/bg.mp4
-- 나중에 이미지를 교체해도 코드는 그대로 두고 이 테이블의 path 만 바꾸면 된다.
-- ============================================================================

create extension if not exists "pgcrypto";

-- 자산 종류
do $$
begin
  if not exists (select 1 from pg_type where typname = 'asset_kind') then
    create type public.asset_kind as enum ('image', 'vector', 'video', 'poster', 'font', 'other');
  end if;
end
$$;

create table if not exists public.site_assets (
  id            uuid primary key default gen_random_uuid(),

  -- 코드에서 쓰는 고유 키. 소문자/숫자/점/하이픈만. 예) 'hero.logo.wordmark-dark'
  key           text        not null unique
                            check (key ~ '^[a-z0-9]+([.-][a-z0-9]+)*$'),

  bucket        text        not null
                            check (bucket in ('brand', 'images', 'videos', 'posters')),
  path          text        not null check (length(path) > 0),
  kind          public.asset_kind not null,

  -- 어느 섹션에서 쓰는지 (01-hero, 02-ai-salon ...). 시안 순서와 동일하게.
  section       text,
  sort_order    integer     not null default 0,

  -- 렌더링에 필요한 메타
  width         integer     check (width  is null or width  > 0),
  height        integer     check (height is null or height > 0),
  alt_ko        text,
  alt_en        text,

  -- 영상 전용: 짝이 되는 poster 자산 키
  poster_key    text        references public.site_assets(key) on delete set null,

  is_published  boolean     not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  unique (bucket, path)
);

create index if not exists site_assets_section_idx
  on public.site_assets (section, sort_order);
create index if not exists site_assets_published_idx
  on public.site_assets (is_published) where is_published;

-- updated_at 자동 갱신
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists site_assets_touch_updated_at on public.site_assets;
create trigger site_assets_touch_updated_at
  before update on public.site_assets
  for each row execute function public.touch_updated_at();

-- ----------------------------------------------------------------------------
-- 프로젝트 공통 설정 (스토리지 public base URL 등)
-- ----------------------------------------------------------------------------
create table if not exists public.app_settings (
  key         text primary key,
  value       text not null,
  updated_at  timestamptz not null default now()
);

drop trigger if exists app_settings_touch_updated_at on public.app_settings;
create trigger app_settings_touch_updated_at
  before update on public.app_settings
  for each row execute function public.touch_updated_at();

insert into public.app_settings (key, value) values
  ('storage_public_base_url', 'https://mirofkondedzmbddatnt.supabase.co/storage/v1/object/public')
on conflict (key) do nothing;

-- ----------------------------------------------------------------------------
-- 완성된 public URL 까지 붙여 주는 뷰
-- ----------------------------------------------------------------------------
create or replace view public.site_asset_urls as
select
  a.key,
  a.bucket,
  a.path,
  a.kind,
  a.section,
  a.sort_order,
  a.width,
  a.height,
  a.alt_ko,
  a.alt_en,
  a.poster_key,
  (select s.value from public.app_settings s where s.key = 'storage_public_base_url')
    || '/' || a.bucket || '/' || a.path as url
from public.site_assets a
where a.is_published;

-- ----------------------------------------------------------------------------
-- RLS — 발행된 자산은 누구나 읽기, 쓰기는 로그인 사용자만
-- ----------------------------------------------------------------------------
alter table public.site_assets enable row level security;
alter table public.app_settings enable row level security;

drop policy if exists "published assets are readable by anyone" on public.site_assets;
drop policy if exists "authenticated can manage assets"         on public.site_assets;
drop policy if exists "settings are readable by anyone"         on public.app_settings;
drop policy if exists "authenticated can manage settings"       on public.app_settings;

create policy "published assets are readable by anyone"
  on public.site_assets for select to public using (is_published);

create policy "authenticated can manage assets"
  on public.site_assets for all to authenticated using (true) with check (true);

create policy "settings are readable by anyone"
  on public.app_settings for select to public using (true);

create policy "authenticated can manage settings"
  on public.app_settings for all to authenticated using (true) with check (true);

grant select on public.site_asset_urls to anon, authenticated;
