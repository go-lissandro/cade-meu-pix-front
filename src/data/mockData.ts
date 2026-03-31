import type { Client, Charge, DashboardStats } from '@/types/billing';

export const mockClients: Client[] = [
  { id: '1', name: 'Maria Silva', email: 'maria@email.com', phone: '(11) 99999-1234', notes: 'Cliente premium', isActive: true, createdAt: '2026-01-15' },
  { id: '2', name: 'João Santos', email: 'joao@email.com', phone: '(21) 98888-5678', isActive: true, createdAt: '2026-02-01' },
  { id: '3', name: 'Ana Oliveira', email: 'ana@email.com', phone: '(31) 97777-9012', notes: 'Pagamento sempre em dia', isActive: true, createdAt: '2026-02-10' },
  { id: '4', name: 'Carlos Pereira', email: 'carlos@email.com', phone: '(41) 96666-3456', isActive: false, createdAt: '2025-11-20' },
  { id: '5', name: 'Fernanda Lima', email: 'fernanda@email.com', phone: '(51) 95555-7890', isActive: true, createdAt: '2026-03-01' },
];

export const mockCharges: Charge[] = [
  { id: '1', clientId: '1', clientName: 'Maria Silva', amount: 1500, amountPaid: 0, description: 'Consultoria mensal - Março', dueDate: '2026-03-25', status: 'pending', createdAt: '2026-03-01' },
  { id: '2', clientId: '2', clientName: 'João Santos', amount: 3200, amountPaid: 3200, description: 'Projeto website', dueDate: '2026-03-20', status: 'paid', createdAt: '2026-02-15' },
  { id: '3', clientId: '3', clientName: 'Ana Oliveira', amount: 800, amountPaid: 400, description: 'Manutenção mensal', dueDate: '2026-03-15', status: 'partially_paid', createdAt: '2026-03-01' },
  { id: '4', clientId: '5', clientName: 'Fernanda Lima', amount: 2100, amountPaid: 0, description: 'Design de logo', dueDate: '2026-03-10', status: 'overdue', createdAt: '2026-02-20' },
  { id: '5', clientId: '1', clientName: 'Maria Silva', amount: 950, amountPaid: 0, description: 'Hospedagem anual', dueDate: '2026-03-28', status: 'pending', createdAt: '2026-03-05' },
  { id: '6', clientId: '2', clientName: 'João Santos', amount: 1800, amountPaid: 0, description: 'SEO mensal', dueDate: '2026-03-30', status: 'pending', createdAt: '2026-03-10' },
  { id: '7', clientId: '3', clientName: 'Ana Oliveira', amount: 500, amountPaid: 0, description: 'Suporte técnico', dueDate: '2026-03-05', status: 'overdue', createdAt: '2026-02-25' },
  { id: '8', clientId: '5', clientName: 'Fernanda Lima', amount: 4500, amountPaid: 0, description: 'Desenvolvimento app', dueDate: '2026-04-15', status: 'pending', createdAt: '2026-03-20' },
];

export const mockStats: DashboardStats = {
  totalPending: 4,
  totalPaid: 1,
  totalOverdue: 2,
  totalReceivable: 11350,
  chargesToday: 1,
};
