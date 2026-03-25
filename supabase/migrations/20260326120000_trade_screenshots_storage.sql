-- Private bucket for trade chart screenshots. Paths must be: {auth.uid()}/{filename}
-- Run after initial_schema migration.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'trade-screenshots',
  'trade-screenshots',
  false,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can upload own trade screenshots" on storage.objects;
create policy "Users can upload own trade screenshots"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'trade-screenshots'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can update own trade screenshots" on storage.objects;
create policy "Users can update own trade screenshots"
on storage.objects for update
to authenticated
using (
  bucket_id = 'trade-screenshots'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'trade-screenshots'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can delete own trade screenshots" on storage.objects;
create policy "Users can delete own trade screenshots"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'trade-screenshots'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can read own trade screenshots" on storage.objects;
create policy "Users can read own trade screenshots"
on storage.objects for select
to authenticated
using (
  bucket_id = 'trade-screenshots'
  and (storage.foldername(name))[1] = auth.uid()::text
);
