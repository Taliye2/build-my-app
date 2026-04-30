
-- 1. Drop plaintext password columns from clients
ALTER TABLE public.clients DROP COLUMN IF EXISTS saved_password;
ALTER TABLE public.clients DROP COLUMN IF EXISTS saved_username;

-- 2. Drop plaintext password columns from staff_profiles
ALTER TABLE public.staff_profiles DROP COLUMN IF EXISTS saved_password;
ALTER TABLE public.staff_profiles DROP COLUMN IF EXISTS saved_username;
ALTER TABLE public.staff_profiles DROP COLUMN IF EXISTS password_hash;

-- 3. Fix storage policies for person-documents and enrollment-documents
-- Remove the overly permissive bucket-only-check policies
DROP POLICY IF EXISTS "Authenticated users can upload person documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update person documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete person documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload enrollment documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update enrollment documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete enrollment documents" ON storage.objects;

-- Remove the broad multi-bucket policy that also covers these buckets
DROP POLICY IF EXISTS "Authenticated users can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete documents" ON storage.objects;

-- Add tenant-scoped SELECT policies
CREATE POLICY "Workspace members can view person documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'person-documents'
  AND has_workspace_access(auth.uid(), ((storage.foldername(name))[1])::uuid)
);

CREATE POLICY "Workspace members can view enrollment documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'enrollment-documents'
  AND has_workspace_access(auth.uid(), ((storage.foldername(name))[1])::uuid)
);

-- Add tenant-scoped INSERT policies
CREATE POLICY "Workspace members can upload person documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'person-documents'
  AND has_workspace_access(auth.uid(), ((storage.foldername(name))[1])::uuid)
);

CREATE POLICY "Workspace members can upload enrollment documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'enrollment-documents'
  AND has_workspace_access(auth.uid(), ((storage.foldername(name))[1])::uuid)
);

-- Add tenant-scoped UPDATE policies
CREATE POLICY "Workspace members can update person documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'person-documents'
  AND has_workspace_access(auth.uid(), ((storage.foldername(name))[1])::uuid)
);

CREATE POLICY "Workspace members can update enrollment documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'enrollment-documents'
  AND has_workspace_access(auth.uid(), ((storage.foldername(name))[1])::uuid)
);

-- Add tenant-scoped DELETE policies (managers+)
CREATE POLICY "Managers can delete person documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'person-documents'
  AND has_role_or_higher(((storage.foldername(name))[1])::uuid, 'manager'::text)
);

CREATE POLICY "Managers can delete enrollment documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'enrollment-documents'
  AND has_role_or_higher(((storage.foldername(name))[1])::uuid, 'manager'::text)
);
