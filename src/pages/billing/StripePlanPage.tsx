import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles } from 'lucide-react';

const features = [
  'Unlimited clients',
  'Unlimited team members',
  'Advanced reporting & analytics',
  'Email templates & campaigns',
  'Payroll module',
  'Programs module',
  'All integrations',
  'Priority support',
];

const StripePlanPage: React.FC = () => {
  return (
    <div className="animate-fade-in space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">Free Plan</h1>
        <p className="text-sm text-muted-foreground mt-1">
          The platform is 100% free for invited users. No payment required.
        </p>
      </div>

      <Card className="border-primary shadow-lg relative">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground gap-1"><Sparkles className="h-3 w-3" />Current Plan: Free</Badge>
        </div>
        <CardHeader className="pt-8">
          <CardTitle className="text-2xl">Free – Full Access</CardTitle>
          <CardDescription>Everything included, for everyone on your team.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="grid sm:grid-cols-2 gap-2">
            {features.map(f => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-success shrink-0" />{f}
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground pt-2">
            New members can join your workspace through invite links generated on the Team page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StripePlanPage;