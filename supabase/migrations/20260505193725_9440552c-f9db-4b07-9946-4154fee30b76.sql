
-- 1. Make invites flexible
ALTER TABLE public.invites
  ALTER COLUMN expires_at DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS max_uses INTEGER,
  ADD COLUMN IF NOT EXISTS uses_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_by UUID;

-- 2. All workspaces become free / fully unlocked
UPDATE public.workspaces
SET plan_status = 'active',
    plan_key = 'free',
    access_state = 'ACTIVE_PAID'
WHERE plan_status IS DISTINCT FROM 'active'
   OR plan_key IS DISTINCT FROM 'free'
   OR access_state IS DISTINCT FROM 'ACTIVE_PAID';

-- 3. Public lookup of invite by token (only safe fields)
CREATE OR REPLACE FUNCTION public.get_invite_by_token(_token text)
RETURNS TABLE (
  id uuid,
  workspace_id uuid,
  workspace_name text,
  email text,
  full_name text,
  role workspace_role,
  status text,
  expires_at timestamptz,
  max_uses integer,
  uses_count integer
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT i.id, i.workspace_id, w.name AS workspace_name, i.email, i.full_name,
         i.role, i.status, i.expires_at, i.max_uses, i.uses_count
  FROM public.invites i
  JOIN public.workspaces w ON w.id = i.workspace_id
  WHERE i.token = _token
  LIMIT 1;
$$;

-- 4. Accept invite RPC: caller must be authenticated.
CREATE OR REPLACE FUNCTION public.accept_invite(_token text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _invite public.invites%ROWTYPE;
  _user_id uuid := auth.uid();
  _user_email text;
  _full_name text;
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO _invite FROM public.invites WHERE token = _token LIMIT 1;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid invite token';
  END IF;

  IF _invite.status NOT IN ('pending','active') THEN
    RAISE EXCEPTION 'Invite is no longer valid';
  END IF;

  IF _invite.expires_at IS NOT NULL AND _invite.expires_at < now() THEN
    RAISE EXCEPTION 'Invite has expired';
  END IF;

  IF _invite.max_uses IS NOT NULL AND _invite.uses_count >= _invite.max_uses THEN
    RAISE EXCEPTION 'Invite has reached its usage limit';
  END IF;

  SELECT email, COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name')
  INTO _user_email, _full_name
  FROM auth.users WHERE id = _user_id;

  IF _invite.email IS NOT NULL AND lower(_invite.email) <> lower(COALESCE(_user_email,'')) THEN
    RAISE EXCEPTION 'Invite email does not match your account';
  END IF;

  -- Ensure profile exists
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (_user_id, COALESCE(_full_name, _invite.full_name), _user_email)
  ON CONFLICT (user_id) DO NOTHING;

  -- Add as workspace member if not already
  INSERT INTO public.workspace_members (workspace_id, user_id, role, status, full_name)
  VALUES (_invite.workspace_id, _user_id, _invite.role, 'active', COALESCE(_full_name, _invite.full_name))
  ON CONFLICT (workspace_id, user_id) DO UPDATE SET status = 'active', role = EXCLUDED.role;

  -- Increment usage / mark accepted
  UPDATE public.invites
  SET uses_count = uses_count + 1,
      status = CASE
        WHEN max_uses IS NULL THEN status
        WHEN uses_count + 1 >= max_uses THEN 'accepted'
        ELSE status
      END,
      updated_at = now()
  WHERE id = _invite.id;

  RETURN _invite.workspace_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_invite_by_token(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.accept_invite(text) TO authenticated;
