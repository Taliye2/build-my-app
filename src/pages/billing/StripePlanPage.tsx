import React from 'react';
import { Link } from 'react-router-dom';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowLeft } from 'lucide-react';

const plans = [
  { key: 'community', name: 'Community', price: 'Free', description: 'Get started with basics', features: ['3 clients', '1 user', 'Basic reporting', 'Email support'] },
  { key: 'growth', name: 'Growth', price: '$49/mo', description: 'For growing organizations', features: ['Unlimited clients', '10 users', 'Advanced reporting', 'Email templates', 'Priority support'] },
  { key: 'scale', name: 'Scale', price: '$99/mo', description: 'Full platform access', features: ['Unlimited clients', 'Unlimited users', 'Payroll & analytics', 'Programs module', 'Custom integrations', 'Dedicated support'], popular: true },
];

const StripePlanPage: React.FC = () => {
  const { activeWorkspace } = useWorkspace();
  const currentPlan = activeWorkspace?.plan_key || 'community';

  return (
    <div className="animate-fade-in space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon"><Link to="/billing"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <div><h1 className="text-2xl font-semibold">Choose a Plan</h1><p className="text-sm text-muted-foreground mt-1">Select the best plan for your organization</p></div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <Card key={plan.key} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
            {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge className="bg-primary text-primary-foreground">Most Popular</Badge></div>}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <p className="text-3xl font-bold mt-2">{plan.price}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-success shrink-0" />{f}</li>
                ))}
              </ul>
              <Button className="w-full" variant={currentPlan === plan.key ? 'outline' : 'default'} disabled={currentPlan === plan.key}>
                {currentPlan === plan.key ? 'Current Plan' : 'Select Plan'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StripePlanPage;