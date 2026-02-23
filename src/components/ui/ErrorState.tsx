import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Nao foi possivel carregar os dados',
  description = 'Verifique sua conexao e tente novamente.',
  onRetry
}: ErrorStateProps) {
  return (
    <div className="rounded-[6px] border border-red-200 bg-red-50 p-8 text-center">
      <h3 className="text-xl font-semibold text-red-700">{title}</h3>
      <p className="mt-2 text-sm text-red-600">{description}</p>
      {onRetry ? (
        <div className="mt-4">
          <Button variant="danger" onClick={onRetry}>
            Tentar novamente
          </Button>
        </div>
      ) : null}
    </div>
  );
}
