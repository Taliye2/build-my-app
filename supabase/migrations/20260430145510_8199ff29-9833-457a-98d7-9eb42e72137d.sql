
-- 1. Create is_system_admin() helper
CREATE OR REPLACE FUNCTION public.is_system_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.system_admins WHERE user_id = auth.uid()
  );
$$;

-- Revoke anon execution on is_system_admin
REVOKE EXECUTE ON FUNCTION public.is_system_admin() FROM anon;

-- 2. Fix leads RLS: drop permissive policies, restrict to system admins
DROP POLICY IF EXISTS "Authenticated users can read leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can update leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can delete leads" ON public.leads;

CREATE POLICY "System admins can read leads"
ON public.leads FOR SELECT TO authenticated
USING (public.is_system_admin());

CREATE POLICY "System admins can insert leads"
ON public.leads FOR INSERT TO authenticated
WITH CHECK (public.is_system_admin());

CREATE POLICY "System admins can update leads"
ON public.leads FOR UPDATE TO authenticated
USING (public.is_system_admin());

CREATE POLICY "System admins can delete leads"
ON public.leads FOR DELETE TO authenticated
USING (public.is_system_admin());

-- 3. Fix storage: drop public/unauthenticated SELECT policies on sensitive buckets
DROP POLICY IF EXISTS "Anyone can view person documents" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view enrollment documents" ON storage.objects;
DROP POLICY IF EXISTS "Public Access for client-documents" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view general documents" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view documents" ON storage.objects;

-- Drop overly broad write policies on documents bucket
DROP POLICY IF EXISTS "Authenticated users can upload general documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update general documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete general documents" ON storage.objects;

-- Make sensitive buckets private
UPDATE storage.buckets SET public = false WHERE id IN ('person-documents', 'enrollment-documents', 'client-documents');

-- 4. Revoke anon execute on security definer functions that shouldn't be public
REVOKE EXECUTE ON FUNCTION public.has_tenant_access(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_user_role(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role_or_higher(uuid, app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role_or_higher(uuid, text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_workspace_role(uuid, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_workspace_access(uuid, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_provider_rate(uuid, uuid, uuid, date) FROM anon;
REVOKE EXECUTE ON FUNCTION public.create_tenant_with_owner_membership(text, text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.cleanup_old_audit_logs(integer) FROM anon;
REVOKE EXECUTE ON FUNCTION public.write_audit_log() FROM anon;
