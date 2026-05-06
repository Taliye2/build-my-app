
DO $$
DECLARE r record;
BEGIN
  -- quickbooks_connections
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='quickbooks_connections') THEN
    EXECUTE 'ALTER TABLE public.quickbooks_connections ENABLE ROW LEVEL SECURITY';
    FOR r IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='quickbooks_connections' LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.quickbooks_connections', r.policyname);
    END LOOP;
    EXECUTE $POL$
      CREATE POLICY "Owners/Admins manage quickbooks_connections"
      ON public.quickbooks_connections FOR ALL TO authenticated
      USING (public.get_workspace_role(workspace_id, auth.uid()) IN ('OWNER','ADMIN'))
      WITH CHECK (public.get_workspace_role(workspace_id, auth.uid()) IN ('OWNER','ADMIN'))
    $POL$;
  END IF;

  -- quickbooks_tokens
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='quickbooks_tokens') THEN
    EXECUTE 'ALTER TABLE public.quickbooks_tokens ENABLE ROW LEVEL SECURITY';
    FOR r IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='quickbooks_tokens' LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.quickbooks_tokens', r.policyname);
    END LOOP;
    EXECUTE $POL$
      CREATE POLICY "Admins+ manage quickbooks_tokens"
      ON public.quickbooks_tokens FOR ALL TO authenticated
      USING (public.has_role_or_higher(tenant_id, 'admin'::text))
      WITH CHECK (public.has_role_or_higher(tenant_id, 'admin'::text))
    $POL$;
  END IF;

  -- workspace_secrets
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='workspace_secrets') THEN
    EXECUTE 'ALTER TABLE public.workspace_secrets ENABLE ROW LEVEL SECURITY';
    FOR r IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='workspace_secrets' LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.workspace_secrets', r.policyname);
    END LOOP;
    EXECUTE $POL$
      CREATE POLICY "Owners/Admins manage workspace_secrets"
      ON public.workspace_secrets FOR ALL TO authenticated
      USING (public.get_workspace_role(workspace_id, auth.uid()) IN ('OWNER','ADMIN'))
      WITH CHECK (public.get_workspace_role(workspace_id, auth.uid()) IN ('OWNER','ADMIN'))
    $POL$;
  END IF;

  -- subscriptions
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='subscriptions') THEN
    EXECUTE 'ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY';
    FOR r IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='subscriptions' LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.subscriptions', r.policyname);
    END LOOP;
    EXECUTE $POL$
      CREATE POLICY "Owners/Admins view subscriptions"
      ON public.subscriptions FOR SELECT TO authenticated
      USING (public.get_workspace_role(workspace_id, auth.uid()) IN ('OWNER','ADMIN'))
    $POL$;
  END IF;
END $$;

-- audit_logs: drop client-permitting INSERT policies, add explicit deny
DROP POLICY IF EXISTS "Allow authenticated insert to audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Audit logs insert policy" ON public.audit_logs;
DROP POLICY IF EXISTS "Users can insert audit logs for their workspaces" ON public.audit_logs;
DROP POLICY IF EXISTS "Deny client inserts to audit_logs" ON public.audit_logs;
CREATE POLICY "Deny client inserts to audit_logs"
ON public.audit_logs FOR INSERT TO authenticated, anon
WITH CHECK (false);

-- workspaces: revoke select on stripe columns
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='workspaces' AND column_name='stripe_customer_id') THEN
    REVOKE SELECT (stripe_customer_id, stripe_subscription_id) ON public.workspaces FROM authenticated, anon;
    GRANT SELECT (stripe_customer_id, stripe_subscription_id) ON public.workspaces TO service_role;
  END IF;
END $$;

-- invites: remove email-match select
DROP POLICY IF EXISTS "Users can view their own invites by email" ON public.invites;

-- Revoke execute on internal SECURITY DEFINER helpers/triggers
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT p.proname, pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname='public' AND p.prosecdef = true
      AND p.proname IN (
        'write_audit_log','set_updated_at','set_updated_at_metadata','set_timestamps',
        'update_updated_at','update_conversation_last_message_at','lock_approved_events',
        'sync_participant_tenant','memberships_fill_organization_id','cleanup_old_audit_logs'
      )
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION public.%I(%s) FROM PUBLIC, anon, authenticated', r.proname, r.args);
  END LOOP;
END $$;
