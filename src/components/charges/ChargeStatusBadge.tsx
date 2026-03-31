import { type ChargeStatus } from '@/types/billing';
import { cn } from '@/lib/utils';
import { getStatusLabel } from '@/lib/formatters';

const statusStyles: Record<ChargeStatus, string> = {
  pending: 'bg-pending/15 text-pending-foreground border-pending/30',
  partially_paid: 'bg-warning/15 text-warning border-warning/30',
  paid: 'bg-paid/15 text-paid border-paid/30',
  cancelled: 'bg-muted text-muted-foreground border-border',
  overdue: 'bg-overdue/15 text-overdue border-overdue/30',
};

export const ChargeStatusBadge = ({ status }: { status: ChargeStatus }) => (
  <span className={cn(
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
    statusStyles[status]
  )}>
    {getStatusLabel(status)}
  </span>
);
