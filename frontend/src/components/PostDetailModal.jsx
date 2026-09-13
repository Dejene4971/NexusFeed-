import { useState } from 'react';
import { useAuth } from '../context/useAuth';

export const PostDetailModal = ({
  isOpen,
  onClose,
  post,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !post) return null;

  const authorId = post.author?._id || post.author;
  const isOwner = Boolean(user && user._id && authorId && String(user._id) === String(authorId));
  const authorName = post.author?.username || 'Anonymous';
  const authorEmail = post.author?.email || 'Not disclosed';

  const formatTimestamp = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(post._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: 600 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="badge badge-primary">Post Details</span>
            {isOwner && <span className="badge badge-success">Your Post</span>}
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost"
            style={{ padding: '4px 8px', fontSize: '1.2rem', lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Title */}
          <div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                lineHeight: 1.25,
                textTransform: 'capitalize',
                wordBreak: 'break-word',
              }}
            >
              {post.name}
            </h2>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 6,
                fontSize: '0.8rem',
                color: 'var(--text-subtle)',
              }}
            >
              <span>ID: {post._id}</span>
              <button
                onClick={handleCopyId}
                className="btn btn-ghost btn-sm"
                style={{ padding: '2px 6px', fontSize: '0.75rem' }}
              >
                {copied ? 'Copied!' : 'Copy ID'}
              </button>
            </div>
          </div>

          {/* Description Block */}
          <div
            style={{
              padding: '16px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontSize: '1rem',
              lineHeight: 1.6,
              color: 'var(--text-main)',
            }}
          >
            {post.description}
          </div>

          {/* Metadata Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 12,
            }}
          >
            <div
              className="card"
              style={{ padding: '12px 14px', background: 'var(--bg-surface)' }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: 2 }}>
                Author
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                @{authorName}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                {authorEmail}
              </div>
            </div>

            <div
              className="card"
              style={{ padding: '12px 14px', background: 'var(--bg-surface)' }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: 2 }}>
                Target Age
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary)' }}>
                {post.age} years old
              </div>
            </div>

            <div
              className="card"
              style={{ padding: '12px 14px', background: 'var(--bg-surface)' }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: 2 }}>
                Created At
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)' }}>
                {formatTimestamp(post.createdAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          {isOwner && (
            <>
              <button
                onClick={() => {
                  onClose();
                  onEdit(post);
                }}
                className="btn btn-secondary"
              >
                Edit Post
              </button>
              <button
                onClick={() => {
                  onClose();
                  onDelete(post);
                }}
                className="btn btn-danger"
              >
                Delete Post
              </button>
            </>
          )}
          <button onClick={onClose} className="btn btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
