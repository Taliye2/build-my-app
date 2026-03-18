import React from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { ShieldX } from 'lucide-react';

export const AccessDenied: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <ShieldX className="w-8 h-8 text-destructive" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">Access Denied</h2>
      <p className="text-muted-foreground max-w-md">
        You don't have permission to access this page. Contact your workspace administrator for access.
      </p>
    </div>
  );
};
