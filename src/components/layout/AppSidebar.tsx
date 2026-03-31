import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, CalendarDays, Zap, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/clients', icon: Users, label: 'Clientes' },
  { to: '/charges', icon: FileText, label: 'Cobranças' },
  { to: '/calendar', icon: CalendarDays, label: 'Calendário' },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const AppSidebar = ({ open, onClose }: SidebarProps) => {
  const location = useLocation();

  return (
    <>
      {open && <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />}
      <aside className={cn(
        'fixed top-0 left-0 z-50 h-full w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-300 lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between px-5 h-16 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-sidebar-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">CobraPro</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-sidebar-muted hover:text-sidebar-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to;
            return (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
                {label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 mx-3 mb-4 rounded-lg bg-sidebar-accent/60 border border-sidebar-border">
          <p className="text-xs text-sidebar-muted">Plano Atual</p>
          <p className="text-sm font-semibold mt-0.5">Profissional</p>
          <p className="text-xs text-sidebar-muted mt-1">Cobranças ilimitadas</p>
        </div>
      </aside>
    </>
  );
};
