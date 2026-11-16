import { useState, type FormEvent } from 'react';
import { Loader2, Ban } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ChargeStatusBadge } from '@/components/charges/ChargeStatusBadge';
import { QueryState } from '@/components/QueryState';
import { useCancelCharge, useCharge, useRegisterPayment } from '@/hooks/useBilling';
import { formatCurrency, formatDate, todayISO } from '@/lib/formatters';
import type { PaymentMethod } from '@/types/billing';

const methods: { value: PaymentMethod; label: string }[] = [
  { value: 'pix', label: 'Pix' },
  { value: 'transfer', label: 'Transferência' },
  { value: 'cash', label: 'Dinheiro' },
  { value: 'card', label: 'Cartão' },
  { value: 'boleto', label: 'Boleto' },
];
const methodLabel = (m: string) => methods.find((x) => x.value === m)?.label ?? m;

interface Props {
  chargeId: string | null;
  onOpenChange: (open: boolean) => void;
}

export const ChargeDetailDialog = ({ chargeId, onOpenChange }: Props) => {
  const charge = useCharge(chargeId);
  const registerPayment = useRegisterPayment();
  const cancelCharge = useCancelCharge();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('pix');
  const [paymentDate, setPaymentDate] = useState(todayISO());

  const c = charge.data;
  const remaining = c ? Math.max(0, c.amount - c.amountPaid) : 0;
  const canPay = c && c.status !== 'paid' && c.status !== 'cancelled';

  const submitPayment = (e: FormEvent) => {
    e.preventDefault();
    if (!c) return;
    registerPayment.mutate(
      { chargeId: c.id, amount: Number(amount.replace(',', '.')), method, paymentDate },
      {
        onSuccess: () => {
          toast.success('Pagamento registrado');
          setAmount('');
          charge.refetch();
        },
      },
    );
  };

  const cancel = () => {
    if (!c || !window.confirm('Cancelar esta cobrança? Os lembretes param de ser enviados.')) return;
    cancelCharge.mutate(c.id, {
      onSuccess: () => { toast.success('Cobrança cancelada'); charge.refetch(); },
      onError: (e) => toast.error(e.message),
    });
  };

  return (
    <Dialog open={!!chargeId} onOpenChange={(o) => { onOpenChange(o); if (!o) registerPayment.reset(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{c?.description ?? 'Cobrança'}</DialogTitle>
          <DialogDescription>{c ? `${c.clientName} · vence em ${formatDate(c.dueDate)}` : ' '}</DialogDescription>
        </DialogHeader>
        <QueryState isLoading={charge.isLoading} error={charge.error} onRetry={() => charge.refetch()}>
          {c && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div><p className="text-muted-foreground">Valor</p><p className="font-semibold">{formatCurrency(c.amount)}</p></div>
                <div><p className="text-muted-foreground">Pago</p><p className="font-semibold">{formatCurrency(c.amountPaid)}</p></div>
                <div><p className="text-muted-foreground">Status</p><ChargeStatusBadge status={c.status} /></div>
              </div>

              <Separator />
              <div>
                <h4 className="text-sm font-semibold mb-2">Pagamentos</h4>
                {c.payments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum pagamento registrado.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {c.payments.map((p) => (
                      <li key={p.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{formatDate(p.paymentDate)} · {methodLabel(p.paymentMethod)}</span>
                        <span className="font-medium">{formatCurrency(p.amount)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {canPay && (
                <>
                  <Separator />
                  <form onSubmit={submitPayment} className="space-y-3">
                    <h4 className="text-sm font-semibold">Registrar pagamento</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="pay-amount" className="text-xs">Valor (R$)</Label>
                        <Input id="pay-amount" required inputMode="decimal" pattern="[0-9]+([.,][0-9]{1,2})?"
                          placeholder={remaining.toFixed(2).replace('.', ',')} value={amount} onChange={(e) => setAmount(e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="pay-method" className="text-xs">Forma</Label>
                        <Select value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
                          <SelectTrigger id="pay-method"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {methods.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="pay-date" className="text-xs">Data</Label>
                        <Input id="pay-date" type="date" required value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
                      </div>
                    </div>
                    {registerPayment.error && <p role="alert" className="text-sm text-destructive">{registerPayment.error.message}</p>}
                    <div className="flex justify-between gap-2">
                      <Button type="button" variant="ghost" className="text-overdue" onClick={cancel} disabled={cancelCharge.isPending}>
                        <Ban className="h-4 w-4 mr-2" /> Cancelar cobrança
                      </Button>
                      <Button type="submit" disabled={registerPayment.isPending}>
                        {registerPayment.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Registrar
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </div>
          )}
        </QueryState>
      </DialogContent>
    </Dialog>
  );
};
