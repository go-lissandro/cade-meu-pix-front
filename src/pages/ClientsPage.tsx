import { useState } from 'react';
import { Search, Plus, MoreHorizontal, Mail, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockClients } from '@/data/mockData';

const ClientsPage = () => {
  const [search, setSearch] = useState('');
  const filtered = mockClients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" /> Novo Cliente
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((client) => (
          <Card key={client.id} className="animate-fade-in border-border/50 shadow-sm hover:shadow-md transition-all group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                    {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{client.name}</h3>
                    <Badge variant={client.isActive ? 'default' : 'secondary'} className={`text-[10px] mt-0.5 ${client.isActive ? 'bg-paid/15 text-paid border-paid/30' : ''}`}>
                      {client.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 text-muted-foreground h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" /> {client.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" /> {client.phone}
                </div>
              </div>
              {client.notes && (
                <p className="mt-3 text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">{client.notes}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientsPage;
