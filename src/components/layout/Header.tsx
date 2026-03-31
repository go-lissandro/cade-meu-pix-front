import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

export const Header = ({ onMenuClick, title }: HeaderProps) => (
  <header className="h-16 border-b border-border/50 bg-card flex items-center justify-between px-5">
    <div className="flex items-center gap-3">
      <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden text-muted-foreground">
        <Menu className="h-5 w-5" />
      </Button>
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
    </div>
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="text-muted-foreground relative">
        <Bell className="h-5 w-5" />
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-overdue" />
      </Button>
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
        U
      </div>
    </div>
  </header>
);
