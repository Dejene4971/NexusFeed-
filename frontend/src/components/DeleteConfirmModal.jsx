
export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  postName = 'this post',
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: 420 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: 'var(--danger-light)',
                color: 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Delete Post</h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '4px 8px' }}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-main)', marginBottom: 8, fontSize: '0.95rem' }}>
            Are you sure you want to permanently delete{' '}
            <strong style={{ color: 'var(--danger)' }}>&ldquo;{postName}&rdquo;</strong>?
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            This action cannot be reversed. This post will be permanently removed from MongoDB.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn btn-danger"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Confirm Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
