import { DollarSign, Clock, AlertTriangle, CheckCircle2, CalendarDays } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatters';
import type { DashboardStats } from '@/types/billing';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const variantStyles = {
  default: 'bg-primary/10 text-primary',
  success: 'bg-paid/10 text-paid',
  warning: 'bg-pending/10 text-pending-foreground',
  danger: 'bg-overdue/10 text-overdue',
};

const StatCard = ({ title, value, icon, variant = 'default' }: StatCardProps) => (
  <Card className="animate-fade-in border-border/50 shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1 text-foreground">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${variantStyles[variant]}`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const StatsCards = ({ stats }: { stats: DashboardStats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
    <StatCard title="Pendentes" value={stats.totalPending} icon={<Clock className="h-5 w-5" />} variant="warning" />
    <StatCard title="Pagas" value={stats.totalPaid} icon={<CheckCircle2 className="h-5 w-5" />} variant="success" />
    <StatCard title="Vencidas" value={stats.totalOverdue} icon={<AlertTriangle className="h-5 w-5" />} variant="danger" />
    <StatCard title="A Receber" value={formatCurrency(stats.totalReceivable)} icon={<DollarSign className="h-5 w-5" />} />
    <StatCard title="Cobranças Hoje" value={stats.chargesToday} icon={<CalendarDays className="h-5 w-5" />} />
  </div>
);
