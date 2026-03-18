-- Kafiskey Seed Script
-- This script creates a complete sample workspace with realistic data.
-- Run this in your Supabase SQL Editor.

-- 1. Create a Workspace
INSERT INTO workspaces (id, name, plan_status, trial_ends_at)
VALUES (
  'w-seed-001', 
  'Beacon Community Services', 
  'trialing', 
  CURRENT_TIMESTAMP + INTERVAL '14 days'
);

-- 2. Add an Admin User (You should replace the user_id with your actual auth.uid())
-- Note: This assumes you already have a user in auth.users.
-- If you want to seed staff users, you'd usually do that through the app or by creating auth users first.
-- For this seed, we will just create members and profiles linked to placeholder IDs.

-- 3. Create Staff Profiles
INSERT INTO staff_profiles (id, workspace_id, user_id, full_name, title, active)
VALUES 
('s-001', 'w-seed-001', 'u-staff-001', 'Sarah Jenkins', 'Clinical Supervisor', true),
('s-002', 'w-seed-001', 'u-staff-002', 'Marcus Thompson', 'Case Manager', true);

-- 4. Add Workspace Members
INSERT INTO workspace_members (id, workspace_id, user_id, role, status)
VALUES 
('m-001', 'w-seed-001', 'u-staff-001', 'MANAGER', 'active'),
('m-002', 'w-seed-001', 'u-staff-002', 'STAFF', 'active');

-- 5. Create Service Types
INSERT INTO service_types (id, workspace_id, name, mode, required_fields)
VALUES 
('st-001', 'w-seed-001', 'Therapy Session', 'SESSION', '{"session_count": 1}'),
('st-002', 'w-seed-001', 'Case Management', 'HOURLY', '{"requires_start_end": true}');

-- 6. Create Service Templates
INSERT INTO service_templates (id, workspace_id, name, service_type_id, default_rate, note_template)
VALUES 
('tmp-001', 'w-seed-001', 'Individual Counseling', 'st-001', 125.00, 'Goal: [Goal]\nIntervention: [Intervention]\nOutcome: [Outcome]'),
('tmp-002', 'w-seed-001', 'Standard Home Visit', 'st-002', 85.00, 'Observations: [Notes]');

-- 7. Create Clients
INSERT INTO clients (id, workspace_id, first_name, last_name, preferred_name, phone, status, tags)
VALUES 
('c-001', 'w-seed-001', 'John', 'Miller', 'Johnny', '555-0101', 'ACTIVE', ARRAY['high-priority', 'weekly']),
('c-002', 'w-seed-001', 'Elena', 'Rodriguez', 'Elena', '555-0102', 'ACTIVE', ARRAY['program-enrolled']),
('c-003', 'w-seed-001', 'Samuel', 'Grant', 'Sam', '555-0103', 'ACTIVE', ARRAY['bi-weekly']);

-- 8. Create a Program Instance
INSERT INTO program_instances (id, workspace_id, client_id, name, start_date, status, milestones)
VALUES 
('p-001', 'w-seed-001', 'c-002', '12-Week Independent Living', CURRENT_DATE - INTERVAL '30 days', 'ACTIVE', 
 '[{"title": "Initial Assessment", "completed": true}, {"title": "Housing Secured", "completed": false}]');

-- 9. Create Service Events & Records
INSERT INTO service_events (id, workspace_id, client_id, staff_user_id, service_template_id, date, status)
VALUES 
('ev-001', 'w-seed-001', 'c-001', 'u-staff-001', 'tmp-001', CURRENT_DATE - INTERVAL '2 days', 'APPROVED'),
('ev-002', 'w-seed-001', 'c-002', 'u-staff-002', 'tmp-002', CURRENT_DATE - INTERVAL '1 day', 'SUBMITTED');

INSERT INTO service_records (id, workspace_id, service_event_id, goals, interventions, outcome, staff_signature_name, signed_at)
VALUES 
('rec-001', 'w-seed-001', 'ev-001', 'Improve communication', 'Role play exercise', 'Client expressed positive feedback', 'Sarah Jenkins', CURRENT_TIMESTAMP - INTERVAL '2 days'),
('rec-002', 'w-seed-001', 'ev-002', 'Housing search', 'Looked at 3 properties', 'Applied for one apartment', 'Marcus Thompson', CURRENT_TIMESTAMP - INTERVAL '1 day');

-- 10. Create Billing Items
INSERT INTO billing_items (id, workspace_id, client_id, service_record_id, service_template_id, service_date, quantity, rate_amount, line_total, billing_status)
VALUES 
('b-001', 'w-seed-001', 'c-001', 'rec-001', 'tmp-001', CURRENT_DATE - INTERVAL '2 days', 1, 125.00, 125.00, 'Paid'),
('b-002', 'w-seed-001', 'c-002', 'rec-002', 'tmp-002', CURRENT_DATE - INTERVAL '1 day', 1.5, 85.00, 127.50, 'Unbilled');

-- 11. Create a Sample Invoice
INSERT INTO invoices (id, workspace_id, client_id, invoice_number, period_start, period_end, subtotal, status)
VALUES 
('inv-001', 'w-seed-001', 'c-001', 'INV-SAMPLE-001', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE, 125.00, 'Paid');

INSERT INTO invoice_lines (id, workspace_id, invoice_id, description, qty, rate, line_total)
VALUES 
('line-001', 'w-seed-001', 'inv-001', 'Individual Counseling', 1, 125.00, 125.00);
