/**
 * Conversão entre o formato da API (snake_case, decimais como texto) e os
 * tipos usados pelas telas.
 */
import type { Charge, ChargeDetail, ChargeStatus, Client, DashboardStats, Payment, PaymentMethod, User } from '@/types/billing';

export interface ApiUser {
  id: string;
  name: string;
  email: string;
}

export interface ApiClient {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface ApiCharge {
  id: string;
  client_id: string;
  client_name: string | null;
  amount: string | number;
  amount_paid: string | number;
  description: string;
  due_date: string;
  send_at: string;
  status: 'pending' | 'partially_paid' | 'paid' | 'canceled' | 'overdue';
  created_at: string;
}

export interface ApiPayment {
  id: string;
  charge_id: string;
  amount_paid: string | number;
  payment_date: string;
  method: string;
  notes: string | null;
  created_at: string;
}

export interface ApiChargeDetail extends ApiCharge {
  payments: ApiPayment[];
}

export interface ApiDashboard {
  total_pending: number;
  total_paid: number;
  total_overdue: number;
  total_partially_paid: number;
  amount_to_receive: string | number;
  amount_received: string | number;
  charges_today: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

const num = (v: string | number | null | undefined) => Number(v ?? 0);

// A API usa "canceled"; as telas usam "cancelled".
export const toChargeStatus = (s: ApiCharge['status']): ChargeStatus => (s === 'canceled' ? 'cancelled' : s);

export const toUser = (u: ApiUser): User => ({ id: u.id, name: u.name, email: u.email });

export const toClient = (c: ApiClient): Client => ({
  id: c.id,
  name: c.name,
  phone: c.phone,
  email: c.email ?? undefined,
  notes: c.notes ?? undefined,
  isActive: c.status === 'active',
  createdAt: c.created_at,
});

export const toCharge = (c: ApiCharge): Charge => ({
  id: c.id,
  clientId: c.client_id,
  clientName: c.client_name ?? '—',
  amount: num(c.amount),
  amountPaid: num(c.amount_paid),
  description: c.description,
  dueDate: c.due_date,
  sendAt: c.send_at,
  status: toChargeStatus(c.status),
  createdAt: c.created_at,
});

export const toPayment = (p: ApiPayment): Payment => ({
  id: p.id,
  chargeId: p.charge_id,
  amount: num(p.amount_paid),
  paymentDate: p.payment_date,
  paymentMethod: p.method as PaymentMethod,
  notes: p.notes ?? undefined,
  createdAt: p.created_at,
});

export const toChargeDetail = (c: ApiChargeDetail): ChargeDetail => ({
  ...toCharge(c),
  payments: c.payments.map(toPayment),
});

export const toStats = (d: ApiDashboard): DashboardStats => ({
  totalPending: d.total_pending,
  totalPaid: d.total_paid,
  totalOverdue: d.total_overdue,
  totalPartiallyPaid: d.total_partially_paid,
  totalReceivable: num(d.amount_to_receive),
  amountReceived: num(d.amount_received),
  chargesToday: d.charges_today,
});
