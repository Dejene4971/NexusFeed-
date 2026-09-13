import { useState } from 'react';
import { useAuth } from '../context/useAuth';

export const AuthModal = ({
  isOpen,
  onClose,
  initialTab = 'login',
  onSuccess,
}) => {
  const { login, register } = useAuth();
  const [tab, setTab] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'register') {
        const username = formData.username.trim();
        const email = formData.email.trim();
        const password = formData.password;

        if (username.length < 2) {
          throw new Error('Username must be at least 2 characters');
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          throw new Error('A valid email address is required');
        }
        if (password.length < 6 || password.length > 50) {
          throw new Error('Password must be between 6 and 50 characters');
        }

        await register(username, email, password);
        // After register, immediately log the user in
        await login(email, password);
        onSuccess?.('Registered and logged in successfully!');
      } else {
        const email = formData.email.trim();
        const password = formData.password;

        if (!email || !password) {
          throw new Error('Email and password are required');
        }

        await login(email, password);
        onSuccess?.('Logged in successfully!');
      }

      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: 460 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header" style={{ paddingBottom: 12 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setError('');
              }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                fontWeight: 700,
                color: tab === 'login' ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: tab === 'login' ? '2px solid var(--primary)' : '2px solid transparent',
                paddingBottom: 8,
                transition: 'all var(--transition-fast)',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('register');
                setError('');
              }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                fontWeight: 700,
                color: tab === 'register' ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: tab === 'register' ? '2px solid var(--primary)' : '2px solid transparent',
                paddingBottom: 8,
                transition: 'all var(--transition-fast)',
              }}
            >
              Create Account
            </button>
          </div>

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

            {tab === 'register' && (
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
                  Username *
                </label>
                <input
                  type="text"
                  placeholder="e.g. alexander"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required={tab === 'register'}
                  disabled={loading}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: 4, display: 'block' }}>
                  At least 2 characters, lowercase
                </span>
              </div>
            )}

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
                Email Address *
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>

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
                Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={loading}
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-subtle)',
                    fontSize: '0.8rem',
                    padding: '4px',
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {tab === 'register' && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: 4, display: 'block' }}>
                  Must be between 6 and 50 characters
                </span>
              )}
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
                ? tab === 'register'
                  ? 'Creating account...'
                  : 'Signing in...'
                : tab === 'register'
                ? 'Create Account'
                : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
