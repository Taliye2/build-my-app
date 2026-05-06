
-- 1) Remove insecure self-insert policy on workspace_members.
-- Joining a workspace must use the accept_invite() SECURITY DEFINER function,
-- which enforces invite email match AND assigns the role from the invite row.
DROP POLICY IF EXISTS "Invited users can add themselves as members" ON public.workspace_members;

-- 2) Lock notifications INSERT to service_role only to prevent spoofing
-- notifications for other users within the same tenant.
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;

CREATE POLICY "Service role can insert notifications"
ON public.notifications
FOR INSERT
TO service_role
WITH CHECK (true);

-- Explicitly deny client inserts.
CREATE POLICY "Deny client inserts to notifications"
ON public.notifications
FOR INSERT
TO anon, authenticated
WITH CHECK (false);
