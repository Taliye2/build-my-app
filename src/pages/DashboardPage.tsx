import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, FileText, DollarSign, TrendingUp, Clock } from "lucide-react";

interface DashboardStats {
  totalClients: number;
  activeClients: number;
  upcomingEvents: number;
  pendingInvoices: number;
  totalRevenue: number;
  recentServices: number;
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  accent,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  accent?: string;
}) {
  return (
    <Card className="border-border/40 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground font-body">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-xl ${accent || "bg-primary/10"}`}>
          <Icon className={`h-4 w-4 ${accent ? "text-current" : "text-primary"}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-display">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    activeClients: 0,
    upcomingEvents: 0,
    pendingInvoices: 0,
    totalRevenue: 0,
    recentServices: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [clientsRes, activeClientsRes, eventsRes, invoicesRes] = await Promise.all([
          supabase.from("clients").select("id", { count: "exact", head: true }),
          supabase.from("clients").select("id", { count: "exact", head: true }).eq("status", "ACTIVE"),
          supabase.from("service_events").select("id", { count: "exact", head: true }).gte("date", new Date().toISOString().split("T")[0]),
          supabase.from("invoices").select("id, subtotal", { count: "exact" }).eq("status", "DRAFT"),
        ]);

        const pendingTotal = invoicesRes.data?.reduce((sum, inv) => sum + (inv.subtotal || 0), 0) || 0;

        setStats({
          totalClients: clientsRes.count || 0,
          activeClients: activeClientsRes.count || 0,
          upcomingEvents: eventsRes.count || 0,
          pendingInvoices: invoicesRes.count || 0,
          totalRevenue: pendingTotal,
          recentServices: 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">
            {greeting()} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening across your workspace today.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Clients"
            value={loading ? "—" : stats.totalClients}
            icon={Users}
            description={`${stats.activeClients} active`}
          />
          <StatCard
            title="Upcoming Events"
            value={loading ? "—" : stats.upcomingEvents}
            icon={Calendar}
            description="Scheduled sessions"
            accent="bg-accent/10 text-accent"
          />
          <StatCard
            title="Pending Invoices"
            value={loading ? "—" : stats.pendingInvoices}
            icon={FileText}
            description="Awaiting payment"
            accent="bg-warning/10 text-warning"
          />
          <StatCard
            title="Draft Revenue"
            value={loading ? "—" : `$${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            description="From draft invoices"
            accent="bg-success/10 text-success"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Navigate using the sidebar to manage clients, schedule services, handle documents, and process billing.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Activity feed will appear here as you and your team work across the platform.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
