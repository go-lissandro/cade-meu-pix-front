/**
 * Hooks de dados (React Query) para clientes, cobranças, pagamentos e dashboard.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  toCharge, toChargeDetail, toClient, toPayment, toStats,
  type ApiCharge, type ApiChargeDetail, type ApiClient, type ApiDashboard, type ApiPayment, type Paginated,
} from '@/lib/adapters';
import type { PaymentMethod } from '@/types/billing';

// A API pagina em no máximo 100 itens; as telas filtram no navegador.
const PAGE_LIMIT = 100;

export const queryKeys = {
  clients: ['clients'] as const,
  charges: ['charges'] as const,
  charge: (id: string) => ['charges', id] as const,
  calendar: (year: number, month: number) => ['charges', 'calendar', year, month] as const,
  dashboard: ['dashboard'] as const,
};

// ─── Leitura ──────────────────────────────────────────────

export const useClients = () =>
  useQuery({
    queryKey: queryKeys.clients,
    queryFn: async () => {
      const res = await api.get<Paginated<ApiClient>>(`/clients/?limit=${PAGE_LIMIT}`);
      return { items: res.items.map(toClient), total: res.total };
    },
  });

export const useCharges = () =>
  useQuery({
    queryKey: queryKeys.charges,
    queryFn: async () => {
      const res = await api.get<Paginated<ApiCharge>>(`/charges/?limit=${PAGE_LIMIT}`);
      return { items: res.items.map(toCharge), total: res.total };
    },
  });

export const useCharge = (id: string | null) =>
  useQuery({
    queryKey: queryKeys.charge(id ?? ''),
    enabled: !!id,
    queryFn: async () => toChargeDetail(await api.get<ApiChargeDetail>(`/charges/${id}`)),
  });

export const useCalendar = (year: number, month: number) =>
  useQuery({
    queryKey: queryKeys.calendar(year, month),
    queryFn: async () => {
      const res = await api.get<Record<string, ApiCharge[]>>(`/charges/calendar?year=${year}&month=${month}`);
      return Object.values(res).flat().map(toCharge);
    },
  });

export const useDashboard = () =>
  useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: async () => toStats(await api.get<ApiDashboard>('/dashboard/summary')),
  });

// ─── Escrita ──────────────────────────────────────────────

/** Depois de qualquer alteração em cobranças, dashboard e calendário mudam junto. */
const useInvalidateBilling = () => {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: queryKeys.charges });
    qc.invalidateQueries({ queryKey: queryKeys.dashboard });
  };
};

export interface NewClient {
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}

export const useCreateClient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: NewClient) =>
      toClient(await api.post<ApiClient>('/clients/', {
        ...data,
        email: data.email || null,
        notes: data.notes || null,
      })),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.clients }),
  });
};

export const useSetClientStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) =>
      toClient(await api.patch<ApiClient>(`/clients/${id}/status`, { status: active ? 'active' : 'inactive' })),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.clients }),
  });
};

export interface NewCharge {
  clientId: string;
  amount: number;
  description: string;
  dueDate: string;
  /** Quando a cobrança deve ser enviada ao cliente (ISO). Padrão: agora. */
  sendAt?: string;
}

export const useCreateCharge = () => {
  const invalidate = useInvalidateBilling();
  return useMutation({
    mutationFn: async (data: NewCharge) =>
      toCharge(await api.post<ApiCharge>('/charges/', {
        client_id: data.clientId,
        amount: data.amount.toFixed(2),
        description: data.description,
        due_date: data.dueDate,
        send_at: data.sendAt ?? new Date().toISOString(),
      })),
    onSuccess: invalidate,
  });
};

export const useCancelCharge = () => {
  const invalidate = useInvalidateBilling();
  return useMutation({
    mutationFn: async (id: string) => toCharge(await api.patch<ApiCharge>(`/charges/${id}/cancel`)),
    onSuccess: invalidate,
  });
};

export interface NewPayment {
  chargeId: string;
  amount: number;
  paymentDate: string;
  method: PaymentMethod;
  notes?: string;
}

export const useRegisterPayment = () => {
  const invalidate = useInvalidateBilling();
  return useMutation({
    mutationFn: async ({ chargeId, ...data }: NewPayment) =>
      toPayment(await api.post<ApiPayment>(`/charges/${chargeId}/payments/`, {
        amount_paid: data.amount.toFixed(2),
        payment_date: data.paymentDate,
        method: data.method,
        notes: data.notes || null,
      })),
    onSuccess: invalidate,
  });
};
