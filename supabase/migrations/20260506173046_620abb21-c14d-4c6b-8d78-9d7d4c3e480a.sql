
DO $$
DECLARE r record;
DECLARE tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['service_pricing','programs','program_instances','invoice_lines','documents']
  LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name=tbl) THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);
      FOR r IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename=tbl LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, tbl);
      END LOOP;
      EXECUTE format($f$
        CREATE POLICY "Members view %1$s"
        ON public.%1$I FOR SELECT TO authenticated
        USING (public.has_workspace_access(auth.uid(), workspace_id))
      $f$, tbl);
      EXECUTE format($f$
        CREATE POLICY "Managers+ insert %1$s"
        ON public.%1$I FOR INSERT TO authenticated
        WITH CHECK (public.get_workspace_role(workspace_id, auth.uid()) IN ('OWNER','ADMIN','MANAGER'))
      $f$, tbl);
      EXECUTE format($f$
        CREATE POLICY "Managers+ update %1$s"
        ON public.%1$I FOR UPDATE TO authenticated
        USING (public.get_workspace_role(workspace_id, auth.uid()) IN ('OWNER','ADMIN','MANAGER'))
        WITH CHECK (public.get_workspace_role(workspace_id, auth.uid()) IN ('OWNER','ADMIN','MANAGER'))
      $f$, tbl);
      EXECUTE format($f$
        CREATE POLICY "Owners/Admins delete %1$s"
        ON public.%1$I FOR DELETE TO authenticated
        USING (public.get_workspace_role(workspace_id, auth.uid()) IN ('OWNER','ADMIN'))
      $f$, tbl);
    END IF;
  END LOOP;
END $$;
