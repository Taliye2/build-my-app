
-- 1. Drop password_hash from clients (still present after previous partial migration)
ALTER TABLE public.clients DROP COLUMN IF EXISTS password_hash;

-- 2. Create workspace_secrets table for sensitive keys
CREATE TABLE IF NOT EXISTS public.workspace_secrets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  secret_name text NOT NULL,
  secret_value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(workspace_id, secret_name)
);

ALTER TABLE public.workspace_secrets ENABLE ROW LEVEL SECURITY;

-- Only owners can manage workspace secrets
CREATE POLICY "Owners can manage workspace secrets"
  ON public.workspace_secrets FOR ALL
  USING (get_workspace_role(workspace_id, auth.uid()) = 'OWNER'::workspace_role)
  WITH CHECK (get_workspace_role(workspace_id, auth.uid()) = 'OWNER'::workspace_role);

-- 3. Migrate resend_api_key values to workspace_secrets
INSERT INTO public.workspace_secrets (workspace_id, secret_name, secret_value)
SELECT id, 'resend_api_key', resend_api_key
FROM public.workspaces
WHERE resend_api_key IS NOT NULL AND resend_api_key != ''
ON CONFLICT (workspace_id, secret_name) DO NOTHING;

-- 4. Drop resend_api_key from workspaces
ALTER TABLE public.workspaces DROP COLUMN IF EXISTS resend_api_key;

-- 5. Add updated_at trigger
CREATE TRIGGER set_workspace_secrets_updated_at
  BEFORE UPDATE ON public.workspace_secrets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
