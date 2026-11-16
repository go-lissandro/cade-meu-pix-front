import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChargeStatusBadge } from '@/components/charges/ChargeStatusBadge';
import { ChargeDetailDialog } from '@/components/charges/ChargeDetailDialog';
import { QueryState } from '@/components/QueryState';
import { useCalendar } from '@/hooks/useBilling';
import { formatCurrency, formatDate } from '@/lib/formatters';
import type { Charge } from '@/types/billing';

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const CalendarPage = () => {
  const today = new Date();
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() }); // month 0-11
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { year, month } = cursor;
  const calendar = useCalendar(year, month + 1);
  const monthCharges = useMemo(
    () => [...(calendar.data ?? [])].sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [calendar.data],
  );

  const move = (delta: number) =>
    setCursor(({ year: y, month: m }) => {
      const d = new Date(y, m + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  const { days, startDay } = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return {
      days: Array.from({ length: daysInMonth }, (_, i) => i + 1),
      startDay: new Date(year, month, 1).getDay(),
    };
  }, [year, month]);

  const chargesByDay = useMemo(() => {
    const map: Record<number, Charge[]> = {};
    monthCharges.forEach((c) => {
      const day = Number(c.dueDate.slice(8, 10));
      (map[day] ??= []).push(c);
    });
    return map;
  }, [monthCharges]);

  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
  const monthName = new Date(year, month).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-5 max-w-7xl">
      <Card className="animate-fade-in border-border/50 shadow-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg font-semibold capitalize">{monthName}</CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => move(-1)} aria-label="Mês anterior"><ChevronLeft className="h-4 w-4" /></Button>
            {!isCurrentMonth && (
              <Button variant="ghost" size="sm" onClick={() => setCursor({ year: today.getFullYear(), month: today.getMonth() })}>Hoje</Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => move(1)} aria-label="Próximo mês"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-px bg-border/50 rounded-lg overflow-hidden">
            {DAYS.map((d) => (
              <div key={d} className="bg-muted/50 py-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
            ))}
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-card min-h-[80px]" />
            ))}
            {days.map((day) => {
              const isToday = isCurrentMonth && day === today.getDate();
              const dayCharges = chargesByDay[day] || [];
              return (
                <div key={day} className={`bg-card min-h-[80px] p-1.5 ${isToday ? 'ring-2 ring-primary ring-inset' : ''}`}>
                  <span className={`text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${isToday ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayCharges.slice(0, 2).map((c) => (
                      <button key={c.id} onClick={() => setSelectedId(c.id)} className={`block w-full text-left text-[10px] px-1.5 py-0.5 rounded truncate font-medium ${
                        c.status === 'paid' ? 'bg-paid/10 text-paid' :
                        c.status === 'overdue' ? 'bg-overdue/10 text-overdue' :
                        c.status === 'cancelled' ? 'bg-muted text-muted-foreground line-through' :
                        'bg-pending/10 text-pending-foreground'
                      }`}>
                        {formatCurrency(c.amount)}
                      </button>
                    ))}
                    {dayCharges.length > 2 && (
                      <div className="text-[10px] text-muted-foreground px-1.5">+{dayCharges.length - 2}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="animate-fade-in border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Cobranças do Mês</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <QueryState isLoading={calendar.isLoading} error={calendar.error} onRetry={() => calendar.refetch()}>
            {monthCharges.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma cobrança vence neste mês.</p>}
            {monthCharges.map((charge) => (
              <button key={charge.id} onClick={() => setSelectedId(charge.id)}
                className="w-full text-left flex items-center justify-between py-2 border-b border-border/30 last:border-0 hover:bg-muted/40 rounded px-1">
                <div>
                  <p className="text-sm font-medium text-foreground">{charge.clientName}</p>
                  <p className="text-xs text-muted-foreground">{charge.description} · {formatDate(charge.dueDate)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">{formatCurrency(charge.amount)}</span>
                  <ChargeStatusBadge status={charge.status} />
                </div>
              </button>
            ))}
          </QueryState>
        </CardContent>
      </Card>

      <ChargeDetailDialog chargeId={selectedId} onOpenChange={(o) => { if (!o) setSelectedId(null); }} />
    </div>
  );
};

export default CalendarPage;
