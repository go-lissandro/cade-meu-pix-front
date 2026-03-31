import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentCharges } from '@/components/dashboard/RecentCharges';
import { ChargesChart } from '@/components/dashboard/ChargesChart';
import { mockStats, mockCharges } from '@/data/mockData';

const DashboardPage = () => (
  <div className="space-y-6 max-w-7xl">
    <StatsCards stats={mockStats} />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <RecentCharges charges={mockCharges.slice(0, 5)} />
      </div>
      <ChargesChart />
    </div>
  </div>
);

export default DashboardPage;
