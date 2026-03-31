import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { Header } from './Header';

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/clients': 'Clientes',
  '/charges': 'Cobranças',
  '/calendar': 'Calendário',
};

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = titles[location.pathname] || 'CobraPro';

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Header onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
