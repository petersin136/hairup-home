-- ============================================================================
-- 00-splash / 01-hero 에서 쓰는 자산 등록
-- ----------------------------------------------------------------------------
-- 워드마크는 색을 CSS 로 바꿔야 해서(헤더=#1c1a19, 스플래시=#faf8f5)
-- src/components/brand/Wordmark.tsx 에 인라인 SVG 로 넣었습니다.
-- 여기서는 배포·공유용 원본과 파비콘/OG 만 등록합니다.
--
-- 아래 경로로 Storage 에 업로드한 뒤 이 스크립트를 실행하세요.
--   brand -> logo/wordmark.svg
--   brand -> favicon/favicon.ico
--   brand -> og/og-default.png
-- ============================================================================

insert into public.site_assets
  (key, bucket, path, kind, section, sort_order, width, height, alt_ko, alt_en)
values
  ('brand.wordmark', 'brand', 'logo/wordmark.svg', 'vector', null, 0,
   267, 101, 'hair up', 'hair up'),

  ('brand.favicon',  'brand', 'favicon/favicon.ico', 'other', null, 0,
   null, null, null, null),

  ('brand.og.default', 'brand', 'og/og-default.png', 'image', null, 0,
   1200, 630, 'hair up — 자동화 살롱 AI', 'hair up — automated salon AI')
on conflict (key) do update
  set bucket = excluded.bucket,
      path   = excluded.path,
      kind   = excluded.kind,
      width  = excluded.width,
      height = excluded.height;
