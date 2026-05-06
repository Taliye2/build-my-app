
-- =========================================
-- 1. QuickBooks connections: remove client SELECT
-- =========================================
DROP POLICY IF EXISTS "Owners and admins can view quickbooks connection" ON public.quickbooks_connections;
-- (No replacement — service role bypasses RLS for edge function access)

-- =========================================
-- 2. QuickBooks tokens: remove client ALL access
-- =========================================
DROP POLICY IF EXISTS "QB tokens: admin+ can manage" ON public.quickbooks_tokens;

-- =========================================
-- 3. Workspace secrets: remove client access entirely
-- =========================================
DROP POLICY IF EXISTS "Owners can manage workspace secrets" ON public.workspace_secrets;

-- =========================================
-- 4. Staff profiles: restrict broad member access
-- =========================================
DROP POLICY IF EXISTS "Member access to staff_profiles" ON public.staff_profiles;

CREATE POLICY "Users can view their own staff profile"
ON public.staff_profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins and managers can view staff profiles"
ON public.staff_profiles FOR SELECT
USING (
  get_workspace_role(workspace_id, auth.uid())
    = ANY (ARRAY['OWNER'::workspace_role,'ADMIN'::workspace_role,'MANAGER'::workspace_role])
);

CREATE POLICY "Users can update their own staff profile"
ON public.staff_profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage staff profiles"
ON public.staff_profiles FOR ALL
USING (
  get_workspace_role(workspace_id, auth.uid())
    = ANY (ARRAY['OWNER'::workspace_role,'ADMIN'::workspace_role])
)
WITH CHECK (
  get_workspace_role(workspace_id, auth.uid())
    = ANY (ARRAY['OWNER'::workspace_role,'ADMIN'::workspace_role])
);

-- =========================================
-- 5. Invites: restrict broad member SELECT (token leakage)
-- =========================================
DROP POLICY IF EXISTS "Users can view invites for their workspaces" ON public.invites;
-- Keep:
--  * "Admin and Owner access to invites" (ALL for owners/admins)
--  * "Admins can manage invites" (ALL via membership check)
--  * "Users can view their own invites by email" (recipient lookup)

-- =========================================
-- 6. Queue entries: drop duplicate policies that ignore active status
-- =========================================
DROP POLICY IF EXISTS "Users can view queue entries in their workspace" ON public.queue_entries;
DROP POLICY IF EXISTS "Users can insert queue entries in their workspace" ON public.queue_entries;
DROP POLICY IF EXISTS "Users can update queue entries in their workspace" ON public.queue_entries;
DROP POLICY IF EXISTS "Users can delete queue entries in their workspace" ON public.queue_entries;
-- Remaining "Members can ..." policies use has_workspace_access which enforces status='active'.

-- =========================================
-- 7. Documents storage: enforce active membership on INSERT/UPDATE
-- =========================================
DROP POLICY IF EXISTS "Users can upload documents to their workspace folder" ON storage.objects;
DROP POLICY IF EXISTS "Workspace members can update documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view documents in their workspace folder" ON storage.objects;

CREATE POLICY "Active members can view documents in their workspace folder"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents'
  AND has_workspace_access(auth.uid(), ((storage.foldername(name))[1])::uuid)
);

CREATE POLICY "Active members can upload documents to their workspace folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents'
  AND has_workspace_access(auth.uid(), ((storage.foldername(name))[1])::uuid)
);

CREATE POLICY "Active members can update documents in their workspace folder"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'documents'
  AND has_workspace_access(auth.uid(), ((storage.foldername(name))[1])::uuid)
);

-- =========================================
-- 8. Revoke EXECUTE on internal/trigger SECURITY DEFINER functions
-- =========================================
REVOKE EXECUTE ON FUNCTION public.write_audit_log() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_old_audit_logs(integer) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.memberships_fill_organization_id() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_participant_tenant() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_participant_tenant(uuid) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at_metadata() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_timestamps() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_conversation_last_message_at() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.lock_approved_events() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.current_user_id() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.current_tenant_id() FROM anon, authenticated;
