-- ============================================================================
-- hair up — Supabase 초기 세팅 (한 번에 실행용)
-- ----------------------------------------------------------------------------
-- Supabase 대시보드 → SQL Editor 에 이 파일 전체를 붙여넣고 Run 하세요.
-- 여러 번 실행해도 안전합니다(멱등).
--
-- 들어 있는 것
--   1) 스토리지 버킷 5개 (brand / images / videos / posters / uploads)
--   2) 스토리지 RLS 정책
--   3) 자산 레지스트리 테이블 public.site_assets
--   4) 공통 설정 테이블 public.app_settings
--   5) public URL 까지 붙여 주는 뷰 public.site_asset_urls
--   6) 브랜드 자산 시드
-- ============================================================================


-- ############################################################################
-- 1. 스토리지 버킷
-- ----------------------------------------------------------------------------
-- 버킷 분리 원칙
--   brand   : 로고/워드마크/파비콘/OG 이미지 등 브랜드 고정 자산 (거의 안 바뀜)
--   images  : 섹션에 들어가는 사진/일러스트/스크린샷 (자주 교체)
--   videos  : 배경 영상·데모 영상 원본 (mp4 / webm / mov)
--   posters : 영상 첫 프레임(poster) 이미지. videos 와 1:1 로 짝을 이룸
--   uploads : 비공개. 문의 첨부 등 방문자가 올리는 파일
--
-- 폴더 규칙 (버킷 안에서)
--   images/<섹션>/<이름>@<폭>.<확장자>   예) images/03-test/card-01@1440.webp
--   videos/<섹션>/<이름>.<확장자>        예) videos/04-banner/loop.mp4
--   posters/<섹션>/<이름>.<확장자>       예) posters/04-banner/loop.jpg
--   brand/logo/<이름>.<확장자>           예) brand/logo/wordmark.svg
-- ############################################################################

insert into storage.buckets
  (id, name, public, file_size_limit, allowed_mime_types)
values
  ('brand',   'brand',   true,   20 * 1024 * 1024,
   array['image/svg+xml','image/png','image/webp','image/jpeg','image/x-icon','image/vnd.microsoft.icon']),
  ('images',  'images',  true,   30 * 1024 * 1024,
   array['image/png','image/webp','image/jpeg','image/avif','image/gif','image/svg+xml']),
  ('videos',  'videos',  true,  500 * 1024 * 1024,
   array['video/mp4','video/webm','video/quicktime']),
  ('posters', 'posters', true,   10 * 1024 * 1024,
   array['image/png','image/webp','image/jpeg','image/avif']),
  ('uploads', 'uploads', false,  50 * 1024 * 1024,
   null)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;


-- ############################################################################
-- 2. 스토리지 RLS — 공개 버킷은 누구나 읽기, 쓰기는 로그인 사용자만
-- ############################################################################

drop policy if exists "public buckets are readable by anyone"      on storage.objects;
drop policy if exists "authenticated can upload to public buckets" on storage.objects;
drop policy if exists "authenticated can update public buckets"    on storage.objects;
drop policy if exists "authenticated can delete public buckets"    on storage.objects;
drop policy if exists "uploads are private to their owner"         on storage.objects;

create policy "public buckets are readable by anyone"
  on storage.objects for select
  to public
  using (bucket_id in ('brand', 'images', 'videos', 'posters'));

create policy "authenticated can upload to public buckets"
  on storage.objects for insert
  to authenticated
  with check (bucket_id in ('brand', 'images', 'videos', 'posters'));

create policy "authenticated can update public buckets"
  on storage.objects for update
  to authenticated
  using (bucket_id in ('brand', 'images', 'videos', 'posters'))
  with check (bucket_id in ('brand', 'images', 'videos', 'posters'));

create policy "authenticated can delete public buckets"
  on storage.objects for delete
  to authenticated
  using (bucket_id in ('brand', 'images', 'videos', 'posters'));

-- 비공개 버킷: 올린 사람만 접근
create policy "uploads are private to their owner"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'uploads' and owner = auth.uid())
  with check (bucket_id = 'uploads' and owner = auth.uid());


-- ############################################################################
-- 3. 자산 레지스트리
-- ----------------------------------------------------------------------------
-- 코드에서는 파일 경로 대신 asset key 로만 참조합니다.
--   예) asset('hero.background.video')
--       → https://<project>.supabase.co/storage/v1/object/public/videos/01-hero/bg.mp4
-- 나중에 이미지를 교체해도 코드는 그대로 두고 이 테이블의 path 만 바꾸면 됩니다.
-- ############################################################################

create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'asset_kind') then
    create type public.asset_kind as enum ('image', 'vector', 'video', 'poster', 'font', 'other');
  end if;
end
$$;

create table if not exists public.site_assets (
  id            uuid primary key default gen_random_uuid(),

  -- 코드에서 쓰는 고유 키. 소문자/숫자/점/하이픈만. 예) 'hero.logo.wordmark'
  key           text        not null unique
                            check (key ~ '^[a-z0-9]+([.-][a-z0-9]+)*$'),

  bucket        text        not null
                            check (bucket in ('brand', 'images', 'videos', 'posters')),
  path          text        not null check (length(path) > 0),
  kind          public.asset_kind not null,

  -- 어느 섹션에서 쓰는지 (01-hero, 03-test ...). 시안 순서와 동일하게.
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


-- ############################################################################
-- 4. 공통 설정
-- ############################################################################

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
  ('storage_public_base_url',
   'https://mirofkondedzmbddatnt.supabase.co/storage/v1/object/public')
on conflict (key) do update set value = excluded.value;


-- ############################################################################
-- 5. public URL 까지 붙여 주는 뷰
-- ############################################################################

-- security_invoker: 뷰를 조회한 사용자의 권한으로 RLS 를 평가합니다.
create or replace view public.site_asset_urls
with (security_invoker = on) as
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


-- ############################################################################
-- 6. 테이블 RLS
-- ############################################################################

alter table public.site_assets  enable row level security;
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


-- ############################################################################
-- 7. 브랜드 자산 시드
-- ----------------------------------------------------------------------------
-- 워드마크는 헤더(#1c1a19)와 스플래시(#faf8f5)에서 색을 바꿔 써야 해서
-- src/components/brand/Wordmark.tsx 에 인라인 SVG 로 넣었습니다.
-- 여기서는 배포·공유용 원본과 파비콘/OG 만 등록합니다.
--
-- 아래 경로로 Storage 에 파일을 올린 뒤 이 블록을 실행하세요.
--   brand -> logo/wordmark.svg
--   brand -> favicon/favicon.ico
--   brand -> og/og-default.png
-- ############################################################################

insert into public.site_assets
  (key, bucket, path, kind, section, sort_order, width, height, alt_ko, alt_en)
values
  ('brand.wordmark',   'brand', 'logo/wordmark.svg',   'vector', null, 0,
   267, 101, 'hair up', 'hair up'),

  ('brand.favicon',    'brand', 'favicon/favicon.ico', 'other',  null, 0,
   null, null, null, null),

  ('brand.og.default', 'brand', 'og/og-default.png',   'image',  null, 0,
   1200, 630, 'hair up — 자동화 살롱 AI', 'hair up — automated salon AI')
on conflict (key) do update
  set bucket = excluded.bucket,
      path   = excluded.path,
      kind   = excluded.kind,
      width  = excluded.width,
      height = excluded.height;


-- ============================================================================
-- 확인용
-- ============================================================================
-- select id, public, file_size_limit from storage.buckets order by id;
-- select key, url from public.site_asset_urls order by key;
