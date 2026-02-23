import { Button } from '@/components/ui/Button';

interface ProductsPaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
}

function getMobileVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 3) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, currentPage, totalPages]);
  return Array.from(pages).sort((a, b) => a - b);
}

export function ProductsPagination({
  totalItems,
  itemsPerPage,
  currentPage,
  totalPages,
  onPageChange
}: ProductsPaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const visiblePages = getVisiblePages(currentPage, totalPages);
  const mobileVisiblePages = getMobileVisiblePages(currentPage, totalPages);

  return (
    <footer className="flex flex-col items-end gap-2 px-3 py-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-5">
      <p className="text-xs text-slate-600 sm:text-sm">
        Mostrando {startItem} a {endItem} de {totalItems} resultados
      </p>

      <div className="flex items-center gap-1 sm:gap-1.5">
        <Button
          type="button"
          variant="secondary"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="h-8 rounded-lg px-2 text-xs font-semibold sm:h-10 sm:px-4 sm:text-sm"
          aria-label="Pagina anterior"
        >
          <span className="sm:hidden">&lt;</span>
          <span className="hidden sm:inline">&lt; Anterior</span>
        </Button>

        <div className="flex items-center gap-1 sm:hidden">
          {mobileVisiblePages.map((page) => (
            <button
              key={`mobile-page-${page}`}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={currentPage === page ? 'page' : undefined}
              className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-semibold ${
                currentPage === page
                  ? 'bg-slate-900 text-white'
                  : 'border border-transparent bg-transparent text-slate-700'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-1.5 sm:flex">
          {visiblePages.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={currentPage === page ? 'page' : undefined}
              className={`inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-semibold ${
                currentPage === page
                  ? 'bg-slate-900 text-white'
                  : 'border border-transparent bg-transparent text-slate-700'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="h-8 rounded-lg px-2 text-xs font-semibold sm:h-10 sm:px-4 sm:text-sm"
          aria-label="Proxima pagina"
        >
          <span className="sm:hidden">&gt;</span>
          <span className="hidden sm:inline">Proximo &gt;</span>
        </Button>
      </div>
    </footer>
  );
}
