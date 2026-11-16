export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (dateStr: string): string => {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR');
};

export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'Pendente',
    partially_paid: 'Parcial',
    paid: 'Paga',
    cancelled: 'Cancelada',
    overdue: 'Vencida',
  };
  return labels[status] || status;
};

/** A API guarda só os dígitos (ex.: 31999990000); exibe como (31) 99999-0000. */
export const formatPhone = (digits: string): string => {
  const d = digits.replace(/\D/g, '');
  const local = d.length > 11 ? d.slice(-11) : d;
  if (local.length === 11) return `(${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
  if (local.length === 10) return `(${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
  return digits;
};

/** Data de hoje no fuso local, no formato aceito pela API (AAAA-MM-DD). */
export const todayISO = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
