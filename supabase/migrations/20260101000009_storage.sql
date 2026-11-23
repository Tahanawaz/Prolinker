-- =============================================================================
-- 0009 · Storage buckets + policies
-- Object keys are always "<user_id>/<file>", so ownership = first folder.
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 2 * 1024 * 1024,
     array['image/jpeg', 'image/png', 'image/webp']),
  ('worker-documents', 'worker-documents', false, 5 * 1024 * 1024,
     array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- avatars (public bucket: files are served by public URL; policies below only
-- govern API access, so listing other users' folders is not possible)
-- ---------------------------------------------------------------------------
create policy avatars_select_own on storage.objects
  for select to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy avatars_insert_own on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy avatars_update_own on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy avatars_delete_own on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- ---------------------------------------------------------------------------
-- worker-documents (private: CNIC, TEVTA certificates)
-- Workers manage their own folder; admins can read all. No client deletes —
-- documents are retained for verification audit.
-- ---------------------------------------------------------------------------
create policy worker_docs_select on storage.objects
  for select to authenticated
  using (
    bucket_id = 'worker-documents'
    and (
      (storage.foldername(name))[1] = (select auth.uid())::text
      or (select public.is_admin())
    )
  );

create policy worker_docs_insert_own on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'worker-documents'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.current_user_role()) = 'worker'
  );

create policy worker_docs_update_own on storage.objects
  for update to authenticated
  using (
    bucket_id = 'worker-documents'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'worker-documents'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
