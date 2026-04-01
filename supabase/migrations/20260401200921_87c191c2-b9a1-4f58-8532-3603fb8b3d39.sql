
-- 1. Fix invites policy: remove public exposure of pending invites
DROP POLICY IF EXISTS "Users can view their own invites or link-only invites" ON invites;
CREATE POLICY "Users can view their own invites by email"
  ON invites FOR SELECT TO authenticated
  USING (email = (auth.jwt() ->> 'email'));

-- 2. Enable RLS on system_admins and restrict access
ALTER TABLE system_admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own admin status"
  ON system_admins FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- 3. RLS policies for billing_events (RLS enabled, no policies)
ALTER TABLE billing_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Workspace members can view billing events"
  ON billing_events FOR SELECT TO authenticated
  USING (has_workspace_access(auth.uid(), workspace_id));

-- 4. RLS for leads table
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage leads"
  ON leads FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. RLS policies for system_audit_logs
ALTER TABLE system_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view their own audit logs"
  ON system_audit_logs FOR SELECT TO authenticated
  USING (admin_id = auth.uid());

-- 6. Fix function search paths
CREATE OR REPLACE FUNCTION public.get_workspace_role(w_id uuid, u_id uuid)
  RETURNS workspace_role
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
AS $function$
DECLARE
    r workspace_role;
BEGIN
    SELECT role INTO r FROM workspace_members
    WHERE workspace_id = w_id AND user_id = u_id;
    RETURN r;
END;
$function$;

CREATE OR REPLACE FUNCTION public.has_workspace_access(u_id uuid, w_id uuid)
  RETURNS boolean
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE user_id = u_id AND workspace_id = w_id AND status = 'active'
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_conversation_last_message_at()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = public
AS $function$
BEGIN
  UPDATE conversations
  SET last_message_at = NEW.created_at,
      updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$function$;
