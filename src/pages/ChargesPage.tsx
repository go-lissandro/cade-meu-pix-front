import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChargeStatusBadge } from '@/components/charges/ChargeStatusBadge';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { QueryState } from '@/components/QueryState';
import { NewChargeDialog } from '@/components/charges/NewChargeDialog';
import { ChargeDetailDialog } from '@/components/charges/ChargeDetailDialog';
import { useCharges } from '@/hooks/useBilling';
import type { ChargeStatus } from '@/types/billing';

const statusFilters: { label: string; value: ChargeStatus | 'all' }[] = [
  { label: 'Todas', value: 'all' },
  { label: 'Pendentes', value: 'pending' },
  { label: 'Pagas', value: 'paid' },
  { label: 'Vencidas', value: 'overdue' },
  { label: 'Parciais', value: 'partially_paid' },
  { label: 'Canceladas', value: 'cancelled' },
];

const ChargesPage = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ChargeStatus | 'all'>('all');
  const [newOpen, setNewOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const charges = useCharges();

  const filtered = (charges.data?.items ?? []).filter(c => {
    const matchSearch = c.clientName.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar cobranças..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setNewOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Nova Cobrança
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {statusFilters.map((f) => (
          <Button
            key={f.value}
            variant={statusFilter === f.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(f.value)}
            className={statusFilter === f.value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <QueryState isLoading={charges.isLoading} error={charges.error} onRetry={() => charges.refetch()}>
      <Card className="animate-fade-in border-border/50 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Cliente</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Descrição</th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Valor</th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Pago</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Vencimento</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((charge) => (
                  <tr key={charge.id} onClick={() => setSelectedId(charge.id)} className="border-b border-border/30 last:border-0 hover:bg-muted/50 transition-colors cursor-pointer">
                    <td className="px-5 py-3.5 text-sm font-medium text-foreground">{charge.clientName}</td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground max-w-[200px] truncate">{charge.description}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-foreground text-right">{formatCurrency(charge.amount)}</td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground text-right">{formatCurrency(charge.amountPaid)}</td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{formatDate(charge.dueDate)}</td>
                    <td className="px-5 py-3.5"><ChargeStatusBadge status={charge.status} /></td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-10 text-center text-muted-foreground text-sm">{charges.data?.total ? 'Nenhuma cobrança encontrada.' : 'Nenhuma cobrança cadastrada. Crie a primeira em "Nova Cobrança".'}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      </QueryState>

      <NewChargeDialog open={newOpen} onOpenChange={setNewOpen} />
      <ChargeDetailDialog chargeId={selectedId} onOpenChange={(o) => { if (!o) setSelectedId(null); }} />
    </div>
  );
};

export default ChargesPage;
