import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateClient } from '@/hooks/useBilling';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const empty = { name: '', phone: '', email: '', notes: '' };

export const NewClientDialog = ({ open, onOpenChange }: Props) => {
  const [form, setForm] = useState(empty);
  const createClient = useCreateClient();

  const set = (field: keyof typeof empty) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    createClient.mutate(form, {
      onSuccess: (client) => {
        toast.success(`Cliente ${client.name} cadastrado`);
        setForm(empty);
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) createClient.reset(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo cliente</DialogTitle>
          <DialogDescription>As cobranças serão enviadas para o WhatsApp e o e-mail informados.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client-name">Nome</Label>
            <Input id="client-name" required value={form.name} onChange={set('name')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-phone">WhatsApp</Label>
            <Input id="client-phone" required placeholder="(31) 99999-0000" value={form.phone} onChange={set('phone')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-email">E-mail (opcional)</Label>
            <Input id="client-email" type="email" value={form.email} onChange={set('email')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-notes">Observações (opcional)</Label>
            <Textarea id="client-notes" rows={2} value={form.notes} onChange={set('notes')} />
          </div>
          {createClient.error && <p role="alert" className="text-sm text-destructive">{createClient.error.message}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={createClient.isPending}>
              {createClient.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
