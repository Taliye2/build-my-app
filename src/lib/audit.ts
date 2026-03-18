import { supabase } from './supabase';

/**
 * Logs an audit event to the database.
 * Strictly avoids logging any PHI (Protected Health Information).
 */
export async function logAudit(
  workspaceId: string,
  actorUserId: string | null | undefined,
  action: string,
  entityType: string,
  entityId?: string,
  metadata: any = {}
) {
  (async () => {
    try {
      let finalActorId = actorUserId;
      let finalWorkspaceId = workspaceId;

      if (!finalActorId || finalActorId === '') {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          finalActorId = session?.user?.id;
        } catch (e) {
          // Continue without actor ID
        }
      }

      if (!finalWorkspaceId || finalWorkspaceId === '') {
        const storedId = localStorage.getItem('activeWorkspaceId');
        if (storedId) {
          finalWorkspaceId = storedId;
        } else if (finalActorId) {
          try {
            const { data: members } = await supabase
              .from('workspace_members')
              .select('workspace_id')
              .eq('user_id', finalActorId)
              .eq('status', 'active')
              .limit(1);

            if (members && members.length > 0) {
              finalWorkspaceId = members[0].workspace_id;
            }
          } catch (e) {
            // Continue without workspace ID
          }
        }
      }

      const isUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

      if (!finalWorkspaceId || !isUuid(finalWorkspaceId)) {
        console.warn('[Audit] Skipping audit log - no valid workspace ID');
        return;
      }

      await supabase.from('audit_logs').insert({
        workspace_id: finalWorkspaceId,
        actor_user_id: finalActorId || null,
        action,
        entity_type: entityType,
        entity_id: entityId || null,
        metadata,
      });
    } catch (err) {
      console.warn('[Audit] Failed to log audit event:', err);
    }
  })();
}
