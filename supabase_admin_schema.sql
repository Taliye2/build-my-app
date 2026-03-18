-- Admin Schema for System-wide operations
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS system_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content_html TEXT NOT NULL,
  target_audience TEXT NOT NULL, -- 'ALL', 'TRIALING', 'ACTIVE', 'EXPIRED'
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'completed', 'canceled')),
  trigger_type TEXT DEFAULT 'Manual' CHECK (trigger_type IN ('Manual', 'Automated')),
  stats JSONB DEFAULT '{"opens": 0, "clicks": 0, "sent": 0}'::jsonb
);

CREATE TABLE IF NOT EXISTS system_campaign_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES system_campaigns(id) ON DELETE CASCADE,
  workspace_id TEXT, 
  recipient_email TEXT NOT NULL,
  resend_id TEXT, -- Capture the ID from Resend for webhook tracking
  status TEXT DEFAULT 'sent',
  sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ
);

-- Enable RLS (though system_campaigns is usually accessed by super-admins)
ALTER TABLE system_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_campaign_logs ENABLE ROW LEVEL SECURITY;

-- Simple policy for super-admins (assuming we use a specific role or check email domain)
-- For now, we'll allow all authenticated users to read/write if they are in the admin portal
-- In a real app, you'd check if user.email ends with @kafiskey.com or has an 'ADMIN' flag in a profiles table
CREATE POLICY "Super admins can manage system campaigns" 
ON system_campaigns FOR ALL 
USING (auth.jwt() ->> 'email' LIKE '%@kafiskey.com');

CREATE POLICY "Super admins can manage system campaign logs" 
ON system_campaign_logs FOR ALL 
USING (auth.jwt() ->> 'email' LIKE '%@kafiskey.com');
