
export const FilterBar = ({
  search,
  onSearchChange,
  sort,
  onSortChange,
  totalResults,
  loading,
}) => {
  return (
    <div
      className="card"
      style={{
        padding: '16px 20px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}
    >
      {/* Search Bar */}
      <div style={{ position: 'relative', flex: '1 1 300px', minWidth: 240 }}>
        <div
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-subtle)',
            pointerEvents: 'none',
            display: 'flex',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title or description..."
          style={{
            paddingLeft: 38,
            paddingRight: search ? 36 : 14,
            height: 42,
            background: 'var(--bg-input)',
          }}
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-subtle)',
              fontSize: '0.9rem',
              padding: 4,
            }}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Sort & Stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            Sort:
          </span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            style={{
              height: 42,
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              width: 'auto',
              minWidth: 140,
              cursor: 'pointer',
            }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        <div
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            padding: '6px 12px',
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            whiteSpace: 'nowrap',
          }}
        >
          {loading ? (
            'Searching...'
          ) : (
            <>
              Found <strong style={{ color: 'var(--text-main)' }}>{totalResults}</strong> {totalResults === 1 ? 'post' : 'posts'}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
