
export const Toast = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        const borderColor = isSuccess
          ? 'var(--success)'
          : isError
          ? 'var(--danger)'
          : 'var(--primary)';

        return (
          <div
            key={toast.id}
            className="toast"
            style={{ borderLeft: `4px solid ${borderColor}` }}
          >
            <div style={{ marginTop: 2, flexShrink: 0 }}>
              {isSuccess && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
              {isError && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              )}
              {!isSuccess && !isError && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              )}
            </div>
            <div style={{ flex: 1, fontSize: '0.9rem' }}>
              {toast.title && (
                <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: 2 }}>
                  {toast.title}
                </div>
              )}
              <div style={{ color: 'var(--text-muted)' }}>{toast.message}</div>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                color: 'var(--text-subtle)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '1rem',
                lineHeight: 1,
              }}
              title="Dismiss"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
};
