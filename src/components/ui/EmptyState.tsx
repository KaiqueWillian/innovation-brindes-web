import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = 'Nenhum produto encontrado',
  description = 'Ajuste os filtros e tente novamente.',
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <div className="rounded-[6px] border border-dashed border-slate-300 bg-white p-8 text-center">
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      {actionLabel && onAction ? (
        <div className="mt-4">
          <Button type="button" variant="secondary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
