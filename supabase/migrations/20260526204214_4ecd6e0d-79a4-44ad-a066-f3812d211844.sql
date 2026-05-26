
DROP POLICY IF EXISTS "Users can view audit logs for their workspaces" ON public.audit_logs;

CREATE OR REPLACE FUNCTION public.has_tenant_access(_tenant_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
SET row_security TO 'off'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.workspace_members wm
    WHERE wm.workspace_id = _tenant_id
      AND wm.user_id = auth.uid()
      AND wm.status = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION public.has_role_or_higher(_tenant_id uuid, _min_role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
SET row_security TO 'off'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.workspace_members wm
    WHERE wm.workspace_id = _tenant_id
      AND wm.user_id = auth.uid()
      AND wm.status = 'active'
      AND (
        wm.role = 'OWNER'::public.workspace_role
        OR (wm.role = 'ADMIN'::public.workspace_role   AND _min_role IN ('admin','manager','staff','auditor'))
        OR (wm.role = 'MANAGER'::public.workspace_role AND _min_role IN ('manager','staff','auditor'))
        OR (wm.role = 'STAFF'::public.workspace_role   AND _min_role IN ('staff','auditor'))
        OR (wm.role = 'READ_ONLY'::public.workspace_role AND _min_role = 'auditor')
      )
  );
$$;
