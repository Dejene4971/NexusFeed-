import { useState } from 'react';

export const PostModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
}) => {
  const [formData, setFormData] = useState(() => ({
    name: initialData?.name || '',
    description: initialData?.description || '',
    age: initialData?.age !== undefined ? initialData.age : '',
  }));
  const [error, setError] = useState('');

  const isEditing = Boolean(initialData?._id);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedName = formData.name.trim();
    const trimmedDesc = formData.description.trim();
    const parsedAge = parseInt(formData.age, 10);

    if (trimmedName.length < 2) {
      setError('Title must be at least 2 characters long');
      return;
    }
    if (!trimmedDesc) {
      setError('Description cannot be empty');
      return;
    }
    if (isNaN(parsedAge) || parsedAge < 1 || parsedAge > 150) {
      setError('Age must be an integer between 1 and 150');
      return;
    }

    onSubmit({
      name: trimmedName,
      description: trimmedDesc,
      age: parsedAge,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            {isEditing ? 'Edit Post' : 'Create New Post'}
          </h2>
          <button
            onClick={onClose}
            className="btn btn-ghost"
            style={{ padding: '4px 8px', fontSize: '1.2rem', lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {error && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--danger-light)',
                  color: 'var(--danger)',
                  border: '1px solid var(--danger-border)',
                  fontSize: '0.875rem',
                }}
              >
                {error}
              </div>
            )}

            {/* Post Name / Title */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: 6,
                  color: 'var(--text-main)',
                }}
              >
                Post Title / Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Mastering Modern Node.js"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={loading}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: 4, display: 'block' }}>
                Must be unique and at least 2 characters.
              </span>
            </div>

            {/* Age Parameter */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: 6,
                  color: 'var(--text-main)',
                }}
              >
                Age Requirement / Target *
              </label>
              <input
                type="number"
                min="1"
                max="150"
                placeholder="e.g. 24"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
                disabled={loading}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: 4, display: 'block' }}>
                Valid range: 1 to 150 years.
              </span>
            </div>

            {/* Description */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: 6,
                  color: 'var(--text-main)',
                }}
              >
                Description / Content *
              </label>
              <textarea
                rows="4"
                placeholder="Write the full description or story behind this post..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                disabled={loading}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Footer */}
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
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? isEditing
                  ? 'Saving changes...'
                  : 'Publishing post...'
                : isEditing
                ? 'Save Changes'
                : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
