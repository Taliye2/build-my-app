
-- Revoke EXECUTE from anon on all SECURITY DEFINER functions in public
REVOKE EXECUTE ON FUNCTION public.accept_invite(text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.create_tenant_with_owner_membership(text, text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_invite_by_token(text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_provider_rate(uuid, uuid, uuid, date) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_workspace_role(uuid, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role_or_higher(uuid, text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_workspace_access(uuid, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_system_admin() FROM anon;
-- get_provider_rate is only used server-side; grant to service_role
GRANT EXECUTE ON FUNCTION public.get_provider_rate(uuid, uuid, uuid, date) TO service_role;
