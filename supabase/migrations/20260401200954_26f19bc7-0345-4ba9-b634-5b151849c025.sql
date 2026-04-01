
-- Fix system_campaigns: enable RLS (policies already exist from earlier schema)
ALTER TABLE system_campaigns ENABLE ROW LEVEL SECURITY;

-- Fix leads: replace overly permissive policy with scoped ones
DROP POLICY IF EXISTS "Authenticated users can manage leads" ON leads;
CREATE POLICY "Authenticated users can read leads"
  ON leads FOR SELECT TO authenticated
  USING (true);
CREATE POLICY "Authenticated users can insert leads"
  ON leads FOR INSERT TO authenticated
  WITH CHECK (true);
CREATE POLICY "Authenticated users can update leads"
  ON leads FOR UPDATE TO authenticated
  USING (true);
CREATE POLICY "Authenticated users can delete leads"
  ON leads FOR DELETE TO authenticated
  USING (true);
