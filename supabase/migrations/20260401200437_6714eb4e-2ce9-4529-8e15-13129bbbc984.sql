
-- Fix foreign keys that block user deletion by changing them to CASCADE or SET NULL

ALTER TABLE audit_logs DROP CONSTRAINT audit_logs_actor_user_id_fkey;
ALTER TABLE audit_logs ADD CONSTRAINT audit_logs_actor_user_id_fkey FOREIGN KEY (actor_user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE billing_items DROP CONSTRAINT billing_items_created_by_fkey;
ALTER TABLE billing_items ADD CONSTRAINT billing_items_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE client_document_versions DROP CONSTRAINT client_document_versions_uploaded_by_fkey;
ALTER TABLE client_document_versions ADD CONSTRAINT client_document_versions_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE client_note_attachments DROP CONSTRAINT client_note_attachments_uploaded_by_fkey;
ALTER TABLE client_note_attachments ADD CONSTRAINT client_note_attachments_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE client_notes DROP CONSTRAINT client_notes_author_id_fkey;
ALTER TABLE client_notes ADD CONSTRAINT client_notes_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE documents DROP CONSTRAINT documents_uploaded_by_fkey;
ALTER TABLE documents ADD CONSTRAINT documents_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE payroll_runs DROP CONSTRAINT payroll_runs_approved_by_fkey;
ALTER TABLE payroll_runs ADD CONSTRAINT payroll_runs_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE payroll_runs DROP CONSTRAINT payroll_runs_created_by_fkey;
ALTER TABLE payroll_runs ADD CONSTRAINT payroll_runs_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE service_events DROP CONSTRAINT service_events_staff_user_id_fkey;
ALTER TABLE service_events ADD CONSTRAINT service_events_staff_user_id_fkey FOREIGN KEY (staff_user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE service_events DROP CONSTRAINT service_events_approved_by_fkey;
ALTER TABLE service_events ADD CONSTRAINT service_events_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE workspaces DROP CONSTRAINT workspaces_created_by_fkey;
ALTER TABLE workspaces ADD CONSTRAINT workspaces_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;
