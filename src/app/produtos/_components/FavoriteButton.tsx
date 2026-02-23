import clsx from 'clsx';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: () => void;
  className?: string;
}

export function FavoriteButton({ isFavorite, onClick, className }: FavoriteButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      className={clsx(
        'inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400',
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className={clsx('h-5 w-5', isFavorite ? 'fill-rose-500 text-rose-500' : 'fill-none')}
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path d="M12 20.2c-.2 0-.4-.1-.6-.2C7.1 17 4 14.2 4 10.8 4 8 6 6 8.7 6c1.5 0 2.7.7 3.3 1.7C12.6 6.7 13.8 6 15.3 6 18 6 20 8 20 10.8c0 3.4-3.1 6.2-7.4 9.2-.2.1-.4.2-.6.2Z" />
      </svg>
    </button>
  );
}
