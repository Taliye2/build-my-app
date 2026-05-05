
DO $$ BEGIN
  CREATE TYPE public.queue_priority AS ENUM ('LOW','NORMAL','HIGH','URGENT');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.queue_entries
  ADD COLUMN IF NOT EXISTS client_id uuid NULL,
  ADD COLUMN IF NOT EXISTS service_needed text NULL,
  ADD COLUMN IF NOT EXISTS service_template_id uuid NULL,
  ADD COLUMN IF NOT EXISTS priority public.queue_priority NOT NULL DEFAULT 'NORMAL',
  ADD COLUMN IF NOT EXISTS notes text NULL,
  ADD COLUMN IF NOT EXISTS assigned_staff_user_id uuid NULL,
  ADD COLUMN IF NOT EXISTS is_walk_in boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS queue_date date NOT NULL DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_queue_entries_ws_date ON public.queue_entries(workspace_id, queue_date);

ALTER TABLE public.queue_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can view queue entries" ON public.queue_entries;
DROP POLICY IF EXISTS "Members can insert queue entries" ON public.queue_entries;
DROP POLICY IF EXISTS "Members can update queue entries" ON public.queue_entries;
DROP POLICY IF EXISTS "Managers can delete queue entries" ON public.queue_entries;

CREATE POLICY "Members can view queue entries"
ON public.queue_entries FOR SELECT TO authenticated
USING (public.has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Members can insert queue entries"
ON public.queue_entries FOR INSERT TO authenticated
WITH CHECK (public.has_workspace_access(auth.uid(), workspace_id) AND created_by_user_id = auth.uid());

CREATE POLICY "Members can update queue entries"
ON public.queue_entries FOR UPDATE TO authenticated
USING (public.has_workspace_access(auth.uid(), workspace_id))
WITH CHECK (public.has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Managers can delete queue entries"
ON public.queue_entries FOR DELETE TO authenticated
USING (public.get_workspace_role(workspace_id, auth.uid()) IN ('OWNER','ADMIN','MANAGER'));

DROP TRIGGER IF EXISTS trg_queue_entries_updated_at ON public.queue_entries;
CREATE TRIGGER trg_queue_entries_updated_at
BEFORE UPDATE ON public.queue_entries
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
