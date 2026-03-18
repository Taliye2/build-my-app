-- Expand Database Schema for Admin Portal

-- 1. Leads Table
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY DEFAULT lower(hex(randomblob(16))),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Qualified', 'Converted')),
  notes TEXT
);

-- 2. Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY DEFAULT lower(hex(randomblob(16))),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content_body TEXT NOT NULL,
  trigger_type TEXT CHECK (trigger_type IN ('Manual', 'Trial_End_3_Days', 'Trial_Expired')),
  stats JSONB DEFAULT '{"opens": 0, "clicks": 0}'::jsonb
);

-- 3. System Audit Logs for Super-Admin actions
CREATE TABLE IF NOT EXISTS system_audit_logs (
  id TEXT PRIMARY KEY DEFAULT lower(hex(randomblob(16))),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  admin_id TEXT NOT NULL,
  target_workspace_id TEXT,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 4. Workspace Extensions
-- Note: Workspaces table might already exist, so we use ALTER
ALTER TABLE workspaces ADD COLUMN IF NOT EXISTS trial_start_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE workspaces ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trialing' CHECK (subscription_status IN ('trialing', 'active', 'past_due', 'canceled', 'expired'));

-- Update TrialDaysLeft logic can be handled in application layer or via a view
-- For now, let's just ensure the columns exist.

-- Seed some data for testing
INSERT INTO workspaces (id, name, trial_start_date, subscription_status)
VALUES ('tilmaan-health-id', 'Tilmaan Health', CURRENT_TIMESTAMP - INTERVAL '25 days', 'trialing')
ON CONFLICT (id) DO UPDATE SET 
  trial_start_date = EXCLUDED.trial_start_date,
  subscription_status = EXCLUDED.subscription_status;

