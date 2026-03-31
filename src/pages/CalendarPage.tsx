import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChargeStatusBadge } from '@/components/charges/ChargeStatusBadge';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { mockCharges } from '@/data/mockData';

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const CalendarPage = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const { days, startDay } = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();
    return {
      days: Array.from({ length: daysInMonth }, (_, i) => i + 1),
      startDay,
    };
  }, [year, month]);

  const chargesByDay = useMemo(() => {
    const map: Record<number, typeof mockCharges> = {};
    mockCharges.forEach((c) => {
      const d = new Date(c.dueDate + 'T00:00:00');
      if (d.getMonth() === month && d.getFullYear() === year) {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(c);
      }
    });
    return map;
  }, [month, year]);

  const monthName = new Date(year, month).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-5 max-w-7xl">
      <Card className="animate-fade-in border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold capitalize">{monthName}</CardTitle>
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
              const isToday = day === today.getDate();
              const dayCharges = chargesByDay[day] || [];
              return (
                <div key={day} className={`bg-card min-h-[80px] p-1.5 ${isToday ? 'ring-2 ring-primary ring-inset' : ''}`}>
                  <span className={`text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${isToday ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayCharges.slice(0, 2).map((c) => (
                      <div key={c.id} className={`text-[10px] px-1.5 py-0.5 rounded truncate font-medium ${
                        c.status === 'paid' ? 'bg-paid/10 text-paid' :
                        c.status === 'overdue' ? 'bg-overdue/10 text-overdue' :
                        'bg-pending/10 text-pending-foreground'
                      }`}>
                        {formatCurrency(c.amount)}
                      </div>
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
          {mockCharges
            .filter(c => {
              const d = new Date(c.dueDate + 'T00:00:00');
              return d.getMonth() === month && d.getFullYear() === year;
            })
            .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
            .map((charge) => (
              <div key={charge.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{charge.clientName}</p>
                  <p className="text-xs text-muted-foreground">{charge.description} · {formatDate(charge.dueDate)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">{formatCurrency(charge.amount)}</span>
                  <ChargeStatusBadge status={charge.status} />
                </div>
              </div>
            ))
          }
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarPage;
