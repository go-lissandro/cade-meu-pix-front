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
