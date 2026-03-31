export type ChargeStatus = 'pending' | 'partially_paid' | 'paid' | 'cancelled' | 'overdue';
export type PaymentMethod = 'pix' | 'transfer' | 'cash' | 'card' | 'boleto';
export type MessageChannel = 'whatsapp' | 'email';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Charge {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  amountPaid: number;
  description: string;
  dueDate: string;
  sendAt?: string;
  status: ChargeStatus;
  createdAt: string;
}

export interface Payment {
  id: string;
  chargeId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalPending: number;
  totalPaid: number;
  totalOverdue: number;
  totalReceivable: number;
  chargesToday: number;
}
