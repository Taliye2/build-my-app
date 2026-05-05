import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Layers } from 'lucide-react';

const ProgramsPage: React.FC = () => {
  return (
    <div className="animate-fade-in space-y-6">
      <div><h1 className="text-2xl font-semibold">Programs</h1><p className="text-sm text-muted-foreground mt-1">Manage service programs and enrollments</p></div>
      <Card>
        <CardContent className="py-16 text-center">
          <Layers className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Programs Module</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Create and manage service programs, track enrollments, and organize clients into structured program cohorts.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgramsPage;