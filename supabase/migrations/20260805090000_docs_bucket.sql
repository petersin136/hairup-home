-- ============================================================================
-- hair up — docs 버킷 (가이드북 PDF, 비공개)
-- ----------------------------------------------------------------------------
-- Send me PDF 용. 공개 URL로 직접 받지 못하게 private.
-- 메일 발송 API 는 service role 로만 읽어 첨부합니다.
--
-- 폴더 규칙
--   docs/<이름>.pdf   예) docs/guidebook.pdf
-- ============================================================================

insert into storage.buckets
  (id, name, public, file_size_limit, allowed_mime_types)
values
  ('docs', 'docs', false, 50 * 1024 * 1024,
   array['application/pdf'])
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- 방문자는 읽기 불가. 로그인 사용자만 대시보드에서 관리.
drop policy if exists "docs are manageable by authenticated" on storage.objects;

create policy "docs are manageable by authenticated"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'docs')
  with check (bucket_id = 'docs');
