
export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  loading = false,
}) => {
  if (totalPages <= 1) return null;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      aria-label="Pagination"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 36,
        marginBottom: 36,
        flexWrap: 'wrap',
      }}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || loading}
        className="btn btn-secondary btn-sm"
        style={{ padding: '8px 14px' }}
      >
        &larr; Prev
      </button>

      {pages[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            disabled={loading}
            className={`btn btn-sm ${currentPage === 1 ? 'btn-primary' : 'btn-secondary'}`}
          >
            1
          </button>
          {pages[0] > 2 && (
            <span style={{ color: 'var(--text-subtle)', padding: '0 4px' }}>&hellip;</span>
          )}
        </>
      )}

      {pages.map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          disabled={loading}
          className={`btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-secondary'}`}
          style={{ minWidth: 36 }}
        >
          {pageNum}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span style={{ color: 'var(--text-subtle)', padding: '0 4px' }}>&hellip;</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={loading}
            className={`btn btn-sm ${currentPage === totalPages ? 'btn-primary' : 'btn-secondary'}`}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || loading}
        className="btn btn-secondary btn-sm"
        style={{ padding: '8px 14px' }}
      >
        Next &rarr;
      </button>
    </nav>
  );
};
