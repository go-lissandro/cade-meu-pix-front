import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentCharges } from '@/components/dashboard/RecentCharges';
import { ChargesChart } from '@/components/dashboard/ChargesChart';
import { QueryState } from '@/components/QueryState';
import { useCharges, useDashboard } from '@/hooks/useBilling';

const DashboardPage = () => {
  const stats = useDashboard();
  const charges = useCharges();

  // "Recentes" = criadas por último
  const recent = [...(charges.data?.items ?? [])]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl">
      <QueryState isLoading={stats.isLoading} error={stats.error} onRetry={() => stats.refetch()}>
        {stats.data && <StatsCards stats={stats.data} />}
      </QueryState>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QueryState isLoading={charges.isLoading} error={charges.error} onRetry={() => charges.refetch()}>
            <RecentCharges charges={recent} />
          </QueryState>
        </div>
        {stats.data && <ChargesChart stats={stats.data} />}
      </div>
    </div>
  );
};

export default DashboardPage;
