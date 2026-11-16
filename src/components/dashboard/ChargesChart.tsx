import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { DashboardStats } from '@/types/billing';

export const ChargesChart = ({ stats }: { stats: DashboardStats }) => {
  const data = [
    { name: 'Pendentes', value: stats.totalPending, color: 'hsl(38, 92%, 50%)' },
    { name: 'Pagas', value: stats.totalPaid, color: 'hsl(142, 71%, 45%)' },
    { name: 'Vencidas', value: stats.totalOverdue, color: 'hsl(0, 72%, 51%)' },
    { name: 'Parciais', value: stats.totalPartiallyPaid, color: 'hsl(199, 89%, 48%)' },
  ];
  const isEmpty = data.every((d) => d.value === 0);

  return (
  <Card className="animate-fade-in border-border/50 shadow-sm">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-semibold">Distribuição de Cobranças</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-[220px]">
        {isEmpty ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            Nenhuma cobrança ainda.
          </div>
        ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(0, 0%, 100%)', border: '1px solid hsl(220, 13%, 91%)', borderRadius: '8px', fontSize: '13px' }}
            />
          </PieChart>
        </ResponsiveContainer>
        )}
      </div>
      <div className="flex flex-wrap gap-4 justify-center mt-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-muted-foreground">{item.name}</span>
            <span className="font-semibold text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
};
