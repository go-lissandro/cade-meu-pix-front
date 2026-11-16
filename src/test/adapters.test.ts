import { describe, expect, it } from 'vitest';
import { toCharge, toClient, toStats } from '@/lib/adapters';
import { formatPhone } from '@/lib/formatters';

describe('adaptadores da API', () => {
  it('converte cobrança, incluindo decimais em texto e o status "canceled"', () => {
    const c = toCharge({
      id: 'c1', client_id: 'k1', client_name: 'Padaria do Zé', amount: '150.00', amount_paid: '50.00',
      description: 'Mensalidade', due_date: '2026-12-10', send_at: '2026-12-01T12:00:00Z',
      status: 'canceled', created_at: '2026-11-16T10:00:00Z',
    });
    expect(c).toMatchObject({ clientName: 'Padaria do Zé', amount: 150, amountPaid: 50, status: 'cancelled', dueDate: '2026-12-10' });
  });

  it('converte cliente: status vira isActive e nulos viram undefined', () => {
    const c = toClient({ id: 'k1', name: 'Ana', phone: '31999990000', email: null, notes: null, status: 'inactive', created_at: 'x' });
    expect(c.isActive).toBe(false);
    expect(c.email).toBeUndefined();
  });

  it('converte o resumo do dashboard', () => {
    expect(toStats({
      total_pending: 2, total_paid: 1, total_overdue: 0, total_partially_paid: 1,
      amount_to_receive: '100.00', amount_received: '50.00', charges_today: 0,
    })).toEqual({
      totalPending: 2, totalPaid: 1, totalOverdue: 0, totalPartiallyPaid: 1,
      totalReceivable: 100, amountReceived: 50, chargesToday: 0,
    });
  });

  it('formata telefone salvo só com dígitos', () => {
    expect(formatPhone('31999990000')).toBe('(31) 99999-0000');
    expect(formatPhone('3133334444')).toBe('(31) 3333-4444');
    expect(formatPhone('5531999990000')).toBe('(31) 99999-0000');
  });
});
