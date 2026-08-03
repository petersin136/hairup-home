-- ============================================================================
-- hair up — Storage buckets
-- ----------------------------------------------------------------------------
-- 버킷 분리 원칙
--   brand   : 로고/워드마크/파비콘/OG 이미지 등 브랜드 고정 자산 (거의 안 바뀜)
--   images  : 섹션에 들어가는 사진/일러스트/스크린샷 (자주 교체)
--   videos  : 배경 영상·데모 영상 원본 (mp4 / webm)
--   posters : 영상 첫 프레임(poster) 이미지. videos 와 1:1 로 짝을 이룸
--   uploads : 비공개. 문의 첨부 등 방문자가 올리는 파일
--
-- 폴더 규칙 (버킷 안에서)
--   images/<section-slug>/<name>@<width>.<ext>     예) images/03-template/card-01@1440.webp
--   videos/<section-slug>/<name>.<ext>             예) videos/02-ai-salon/loop.mp4
--   posters/<section-slug>/<name>.<ext>            예) posters/02-ai-salon/loop.jpg
--   brand/logo/<name>.<ext>                        예) brand/logo/wordmark-cream.svg
-- ============================================================================

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

-- ----------------------------------------------------------------------------
-- RLS — 공개 버킷은 누구나 읽기, 쓰기/수정/삭제는 로그인한 사용자만
-- ----------------------------------------------------------------------------

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
