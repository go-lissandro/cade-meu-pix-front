import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClients, useCreateCharge } from '@/hooks/useBilling';
import { todayISO } from '@/lib/formatters';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const empty = { clientId: '', amount: '', description: '', dueDate: '' };

export const NewChargeDialog = ({ open, onOpenChange }: Props) => {
  const [form, setForm] = useState(empty);
  const clients = useClients();
  const createCharge = useCreateCharge();
  const activeClients = (clients.data?.items ?? []).filter((c) => c.isActive);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    createCharge.mutate(
      {
        clientId: form.clientId,
        amount: Number(form.amount.replace(',', '.')),
        description: form.description,
        dueDate: form.dueDate,
      },
      {
        onSuccess: () => {
          toast.success('Cobrança criada');
          setForm(empty);
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) createCharge.reset(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova cobrança</DialogTitle>
          <DialogDescription>O lembrete é enviado ao cliente a partir de agora.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="charge-client">Cliente</Label>
            <Select value={form.clientId} onValueChange={(v) => setForm((f) => ({ ...f, clientId: v }))}>
              <SelectTrigger id="charge-client">
                <SelectValue placeholder={activeClients.length ? 'Selecione o cliente' : 'Cadastre um cliente antes'} />
              </SelectTrigger>
              <SelectContent>
                {activeClients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="charge-description">Descrição</Label>
            <Input id="charge-description" required value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="charge-amount">Valor (R$)</Label>
              <Input id="charge-amount" required inputMode="decimal" placeholder="150,00" pattern="[0-9]+([.,][0-9]{1,2})?"
                value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="charge-due">Vencimento</Label>
              <Input id="charge-due" type="date" required min={todayISO()} value={form.dueDate}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
            </div>
          </div>
          {createCharge.error && <p role="alert" className="text-sm text-destructive">{createCharge.error.message}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={createCharge.isPending || !form.clientId}>
              {createCharge.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Criar cobrança
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
