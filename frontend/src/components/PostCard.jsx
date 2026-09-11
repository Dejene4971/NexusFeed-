import { useAuth } from '../context/useAuth';

export const PostCard = ({
  post,
  onView,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuth();

  const authorId = post.author?._id || post.author;
  const isOwner = Boolean(user && user._id && authorId && String(user._id) === String(authorId));
  const authorName = post.author?.username || 'Anonymous';

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <article
      className="card card-hover"
      style={{
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        position: 'relative',
      }}
    >
      <div>
        {/* Card Header: Author, Date, and Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: isOwner
                  ? 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)'
                  : 'var(--bg-input)',
                color: isOwner ? '#fff' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                fontWeight: 700,
                border: '1px solid var(--border-subtle)',
                textTransform: 'uppercase',
              }}
            >
              {authorName.charAt(0)}
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>@{authorName}</span>
                {isOwner && (
                  <span
                    className="badge badge-primary"
                    style={{ fontSize: '0.65rem', padding: '1px 6px' }}
                  >
                    You
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                {formatDate(post.createdAt)}
              </div>
            </div>
          </div>

          <div
            className="badge badge-muted"
            title="Target Age Metric"
            style={{ fontSize: '0.75rem' }}
          >
            Age: {post.age}
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onView(post)}
          style={{
            fontSize: '1.2rem',
            marginBottom: 8,
            cursor: 'pointer',
            textTransform: 'capitalize',
            wordBreak: 'break-word',
          }}
          title="Click to view details"
        >
          {post.name}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: '0.92rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            marginBottom: 20,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            wordBreak: 'break-word',
          }}
        >
          {post.description}
        </p>
      </div>

      {/* Card Footer: Action Buttons */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <button
          onClick={() => onView(post)}
          className="btn btn-ghost btn-sm"
          style={{ paddingLeft: 0, color: 'var(--primary)', fontWeight: 600 }}
        >
          Read more &rarr;
        </button>

        {isOwner && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => onEdit(post)}
              className="btn btn-secondary btn-sm"
              title="Edit this post"
              style={{ padding: '6px 10px' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              <span>Edit</span>
            </button>

            <button
              onClick={() => onDelete(post)}
              className="btn btn-danger btn-sm"
              title="Delete this post"
              style={{ padding: '6px 10px' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </article>
  );
};
