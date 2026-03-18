-- Migration to add hipaa_config to workspaces table
-- Run this in your Supabase SQL Editor

ALTER TABLE workspaces 
ADD COLUMN IF NOT EXISTS hipaa_config JSONB DEFAULT '{
  "enabled": false,
  "phi_scope": [],
  "role_permissions": {
    "OWNER": {"view": true, "edit": true},
    "ADMIN": {"view": true, "edit": true},
    "MANAGER": {"view": false, "edit": false},
    "STAFF": {"view": false, "edit": false},
    "READ_ONLY": {"view": false, "edit": false}
  },
  "restrictions": []
}'::jsonb;

-- Ensure slug column exists and is unique
-- ALTER TABLE workspaces ADD COLUMN IF NOT EXISTS slug TEXT;
-- UPDATE workspaces SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substring(id::text, 1, 4) WHERE slug IS NULL;
-- ALTER TABLE workspaces ALTER COLUMN slug SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS workspaces_slug_idx ON workspaces (slug);

-- Update RLS policies if necessary to allow OWNER/ADMIN to update this column
-- (Usually they already have UPDATE permission on the whole row)
