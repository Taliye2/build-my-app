import React from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { AccessDenied } from '@/components/AccessDenied';

type Role = 'OWNER' | 'ADMIN' | 'MANAGER' | 'STAFF' | 'READ_ONLY';

interface RequireRoleProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallback?: React.ReactNode;
}

export const RequireRole: React.FC<RequireRoleProps> = ({
  children,
  allowedRoles,
  fallback = <AccessDenied />
}) => {
  const { activeMember, loading } = useWorkspace();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!activeMember || !allowedRoles.includes(activeMember.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
