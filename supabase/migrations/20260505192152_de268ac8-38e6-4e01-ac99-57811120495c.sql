
-- 1) Restrict quickbooks_connections SELECT to OWNER/ADMIN
DROP POLICY IF EXISTS "Workspace members can view quickbooks connection" ON public.quickbooks_connections;
CREATE POLICY "Owners and admins can view quickbooks connection"
ON public.quickbooks_connections
FOR SELECT
USING (
  public.get_workspace_role(workspace_id, auth.uid()) IN ('OWNER'::workspace_role, 'ADMIN'::workspace_role)
);

-- 2) Fix get_workspace_role to require active membership
CREATE OR REPLACE FUNCTION public.get_workspace_role(w_id uuid, u_id uuid)
RETURNS workspace_role
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    r workspace_role;
BEGIN
    SELECT role INTO r FROM workspace_members
    WHERE workspace_id = w_id AND user_id = u_id AND status = 'active';
    RETURN r;
END;
$function$;

-- 3) Storage: client-documents bucket - replace overly permissive INSERT, add SELECT/DELETE/UPDATE scoped to workspace
DROP POLICY IF EXISTS "Authenticated Upload for client-documents" ON storage.objects;

CREATE POLICY "Workspace members can upload client documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'client-documents'
  AND has_workspace_access(auth.uid(), ((storage.foldername(name))[1])::uuid)
);

CREATE POLICY "Workspace members can view client documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'client-documents'
  AND has_workspace_access(auth.uid(), ((storage.foldername(name))[1])::uuid)
);

CREATE POLICY "Workspace members can update client documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'client-documents'
  AND has_workspace_access(auth.uid(), ((storage.foldername(name))[1])::uuid)
);

CREATE POLICY "Managers can delete client documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'client-documents'
  AND public.get_workspace_role(((storage.foldername(name))[1])::uuid, auth.uid())
      IN ('OWNER'::workspace_role, 'ADMIN'::workspace_role, 'MANAGER'::workspace_role)
);

-- 4) Storage: documents bucket - fix UPDATE policy to enforce workspace membership
DROP POLICY IF EXISTS "Authenticated users can update their documents" ON storage.objects;

CREATE POLICY "Workspace members can update documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'documents'
  AND ((storage.foldername(name))[1] IN (
    SELECT (w.id)::text FROM workspaces w
    JOIN workspace_members m ON m.workspace_id = w.id
    WHERE m.user_id = auth.uid() AND m.status = 'active'
  ))
);
