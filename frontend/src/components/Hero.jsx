import { useAuth } from '../context/useAuth';

export const Hero = ({
  totalPosts,
  onOpenCreatePost,
  onOpenAuth,
}) => {
  const { user, isAuthenticated } = useAuth();

  return (
    <section
      style={{
        position: 'relative',
        padding: '36px 20px 24px',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: 16,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          <span>Express 5 &bull; MongoDB &bull; JWT Auth</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: 14,
          }}
        >
          Explore, Share & Discover{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Community Posts
          </span>
        </h1>

        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--text-muted)',
            marginBottom: 24,
            maxWidth: 580,
            marginInline: 'auto',
          }}
        >
          A full-featured CRUD interface connected to the REST backend with ownership protection, pagination, and real-time search.
        </p>

        {/* Quick Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          {isAuthenticated ? (
            <button
              onClick={onOpenCreatePost}
              className="btn btn-primary btn-lg"
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Create New Post</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth('register')}
                className="btn btn-primary btn-lg"
              >
                Get Started Free
              </button>
              <button
                onClick={() => onOpenAuth('login')}
                className="btn btn-secondary btn-lg"
              >
                Sign In to Post
              </button>
            </>
          )}
        </div>

        {/* Stats Strip */}
        <div
          style={{
            marginTop: 32,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 12,
            maxWidth: 600,
            marginInline: 'auto',
          }}
        >
          <div
            className="card"
            style={{
              padding: '12px 16px',
              textAlign: 'center',
              background: 'var(--bg-card)',
            }}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
              {totalPosts}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Total Posts
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: '12px 16px',
              textAlign: 'center',
              background: 'var(--bg-card)',
            }}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>
              {isAuthenticated ? `@${user?.username}` : 'Guest'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Active Session
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: '12px 16px',
              textAlign: 'center',
              background: 'var(--bg-card)',
            }}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>
              JWT
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Auth Security
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
