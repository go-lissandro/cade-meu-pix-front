import type { ReactNode } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QueryStateProps {
  isLoading: boolean;
  error: unknown;
  onRetry?: () => void;
  children: ReactNode;
}

/** Mostra carregando/erro enquanto a consulta não tem dados. */
export const QueryState = ({ isLoading, error, onRetry, children }: QueryStateProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Carregando...
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <AlertCircle className="h-6 w-6 text-overdue" />
        <p className="text-sm text-muted-foreground">{error instanceof Error ? error.message : 'Erro ao carregar dados.'}</p>
        {onRetry && <Button variant="outline" size="sm" onClick={onRetry}>Tentar novamente</Button>}
      </div>
    );
  }
  return <>{children}</>;
};
