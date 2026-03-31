import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChargeStatusBadge } from '@/components/charges/ChargeStatusBadge';
import { formatCurrency, formatDate } from '@/lib/formatters';
import type { Charge } from '@/types/billing';

export const RecentCharges = ({ charges }: { charges: Charge[] }) => (
  <Card className="animate-fade-in border-border/50 shadow-sm">
    <CardHeader className="pb-3">
      <CardTitle className="text-lg font-semibold">Cobranças Recentes</CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Cliente</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Descrição</th>
              <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Valor</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Vencimento</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {charges.map((charge) => (
              <tr key={charge.id} className="border-b border-border/30 last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-5 py-3.5 text-sm font-medium text-foreground">{charge.clientName}</td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground">{charge.description}</td>
                <td className="px-5 py-3.5 text-sm font-semibold text-foreground text-right">{formatCurrency(charge.amount)}</td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground">{formatDate(charge.dueDate)}</td>
                <td className="px-5 py-3.5"><ChargeStatusBadge status={charge.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);
