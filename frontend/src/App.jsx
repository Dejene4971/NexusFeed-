import { useState, useEffect, useCallback, useRef } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { PostCard } from './components/PostCard';
import { PostModal } from './components/PostModal';
import { PostDetailModal } from './components/PostDetailModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { AuthModal } from './components/AuthModal';
import { Pagination } from './components/Pagination';
import { Toast } from './components/Toast';
import { postsApi, healthApi } from './api/client';

function AppContent() {
  const { isAuthenticated } = useAuth();

  // Posts & Filtering State
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 9,
    pages: 1,
  });
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);

  // Modals & Popups State
  const [authModal, setAuthModal] = useState({ isOpen: false, tab: 'login' });
  const [postModal, setPostModal] = useState({ isOpen: false, post: null, loading: false });
  const [detailModal, setDetailModal] = useState({ isOpen: false, post: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, post: null, loading: false });

  // System Health & Toasts
  const [apiStatus, setApiStatus] = useState({ healthy: false, latency: 0 });
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', title = '') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Periodic Health Check
  useEffect(() => {
    let ignore = false;
    const check = async () => {
      try {
        const data = await healthApi.check();
        if (!ignore) {
          setApiStatus({ healthy: Boolean(data.success), latency: data.latency });
        }
      } catch {
        if (!ignore) {
          setApiStatus({ healthy: false, latency: 0 });
        }
      }
    };

    check();
    const interval = setInterval(check, 30000);
    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, []);

  // Fetch Posts function
  const fetchPosts = useCallback(async (page = 1, searchQuery = search, sortOrder = sort) => {
    try {
      setLoading(true);
      const res = await postsApi.getPosts({
        page,
        limit: 9,
        search: searchQuery,
        sort: sortOrder,
      });

      setPosts(res.data || []);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err) {
      addToast(err.message || 'Failed to load posts', 'error', 'Error');
    } finally {
      setLoading(false);
    }
  }, [search, sort, addToast]);

  // Initial Load
  useEffect(() => {
    let ignore = false;
    const loadInitial = async () => {
      try {
        setLoading(true);
        const res = await postsApi.getPosts({
          page: 1,
          limit: 9,
          search: '',
          sort: 'newest',
        });
        if (!ignore) {
          setPosts(res.data || []);
          if (res.pagination) {
            setPagination(res.pagination);
          }
        }
      } catch (err) {
        if (!ignore) {
          addToast(err.message || 'Failed to load posts', 'error', 'Error');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadInitial();
    return () => {
      ignore = true;
    };
  }, [addToast]);

  // Search debounce ref
  const searchTimeoutRef = useRef(null);

  const handleSearchChange = (val) => {
    setSearch(val);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      fetchPosts(1, val, sort);
    }, 350);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    fetchPosts(1, search, newSort);
  };

  const handlePageChange = (newPage) => {
    fetchPosts(newPage, search, sort);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Post CRUD Operations
  const handleOpenCreatePost = () => {
    if (!isAuthenticated) {
      setAuthModal({ isOpen: true, tab: 'login' });
      addToast('Please sign in or register to publish posts.', 'info', 'Authentication Required');
      return;
    }
    setPostModal({ isOpen: true, post: null, loading: false });
  };

  const handleOpenEditPost = (post) => {
    setPostModal({ isOpen: true, post, loading: false });
  };

  const handlePostSubmit = async (formData) => {
    try {
      setPostModal((prev) => ({ ...prev, loading: true }));

      if (postModal.post?._id) {
        // Update Post
        await postsApi.updatePost(postModal.post._id, formData);
        addToast(`Post "${formData.name}" updated successfully!`, 'success', 'Saved');
      } else {
        // Create Post
        await postsApi.createPost(formData);
        addToast(`Post "${formData.name}" published successfully!`, 'success', 'Published');
      }

      setPostModal({ isOpen: false, post: null, loading: false });
      fetchPosts(pagination.page, search, sort);
    } catch (err) {
      addToast(err.message || 'Operation failed', 'error', 'Failed');
      setPostModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleOpenDelete = (post) => {
    setDeleteModal({ isOpen: true, post, loading: false });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.post?._id) return;
    try {
      setDeleteModal((prev) => ({ ...prev, loading: true }));
      await postsApi.deletePost(deleteModal.post._id);
      addToast(`Post "${deleteModal.post.name}" deleted`, 'success', 'Deleted');
      setDeleteModal({ isOpen: false, post: null, loading: false });
      fetchPosts(pagination.page, search, sort);
    } catch (err) {
      addToast(err.message || 'Failed to delete post', 'error', 'Delete Failed');
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Top Navigation */}
      <Navbar
        apiStatus={apiStatus}
        onOpenAuth={(tab) => setAuthModal({ isOpen: true, tab })}
        onOpenCreatePost={handleOpenCreatePost}
      />

      {/* Main Feed Container */}
      <main style={{ flex: 1, maxWidth: 1200, width: '100%', margin: '0 auto', padding: '0 20px 48px' }}>
        <Hero
          totalPosts={pagination.total}
          onOpenCreatePost={handleOpenCreatePost}
          onOpenAuth={(tab) => setAuthModal({ isOpen: true, tab })}
        />

        {/* Filter and Search Bar */}
        <FilterBar
          search={search}
          onSearchChange={handleSearchChange}
          sort={sort}
          onSortChange={handleSortChange}
          totalResults={pagination.total}
          loading={loading}
        />

        {/* Post Grid */}
        {loading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 20,
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="card"
                style={{ padding: 22, minHeight: 220, display: 'flex', flexDirection: 'column', gap: 14 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="skeleton" style={{ width: 34, height: 34, borderRadius: '50%' }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: 14, width: '50%', marginBottom: 6 }} />
                    <div className="skeleton" style={{ height: 10, width: '30%' }} />
                  </div>
                </div>
                <div className="skeleton" style={{ height: 22, width: '80%' }} />
                <div className="skeleton" style={{ height: 14, width: '100%' }} />
                <div className="skeleton" style={{ height: 14, width: '90%' }} />
                <div className="skeleton" style={{ height: 14, width: '60%', marginTop: 'auto' }} />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div
            className="card"
            style={{
              padding: '64px 24px',
              textAlign: 'center',
              maxWidth: 540,
              margin: '32px auto',
              background: 'var(--bg-card)',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                margin: '0 auto 16px',
                borderRadius: '50%',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: 8 }}>
              {search ? 'No Matching Posts Found' : 'No Posts Yet'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: 20 }}>
              {search
                ? `No posts matched "${search}". Try clearing your search query or check the spelling.`
                : 'The community feed is currently empty. Be the first to create and publish a post!'}
            </p>
            {search ? (
              <button onClick={() => handleSearchChange('')} className="btn btn-secondary">
                Clear Search Filter
              </button>
            ) : (
              <button onClick={handleOpenCreatePost} className="btn btn-primary">
                Create the First Post
              </button>
            )}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 20,
            }}
          >
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onView={(p) => setDetailModal({ isOpen: true, post: p })}
                onEdit={handleOpenEditPost}
                onDelete={handleOpenDelete}
              />
            ))}
          </div>
        )}

        {/* Pagination Navigation */}
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={handlePageChange}
          loading={loading}
        />
      </main>

      {/* Modals */}
      <AuthModal
        key={`auth-${authModal.isOpen}-${authModal.tab}`}
        isOpen={authModal.isOpen}
        initialTab={authModal.tab}
        onClose={() => setAuthModal({ isOpen: false, tab: 'login' })}
        onSuccess={(msg) => addToast(msg, 'success', 'Authenticated')}
      />

      <PostModal
        key={`post-${postModal.isOpen}-${postModal.post?._id || 'new'}`}
        isOpen={postModal.isOpen}
        initialData={postModal.post}
        loading={postModal.loading}
        onClose={() => setPostModal({ isOpen: false, post: null, loading: false })}
        onSubmit={handlePostSubmit}
      />

      <PostDetailModal
        key={`detail-${detailModal.post?._id || 'none'}`}
        isOpen={detailModal.isOpen}
        post={detailModal.post}
        onClose={() => setDetailModal({ isOpen: false, post: null })}
        onEdit={(p) => {
          setDetailModal({ isOpen: false, post: null });
          handleOpenEditPost(p);
        }}
        onDelete={(p) => {
          setDetailModal({ isOpen: false, post: null });
          handleOpenDelete(p);
        }}
      />

      <DeleteConfirmModal
        key={`delete-${deleteModal.post?._id || 'none'}`}
        isOpen={deleteModal.isOpen}
        postName={deleteModal.post?.name}
        loading={deleteModal.loading}
        onClose={() => setDeleteModal({ isOpen: false, post: null, loading: false })}
        onConfirm={handleDeleteConfirm}
      />

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '28px 24px',
          textAlign: 'center',
          background: 'var(--bg-surface)',
          marginTop: 'auto',
          fontSize: '0.875rem',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            &copy; {new Date().getFullYear()} <strong>PostStream</strong>. Built with Express 5, MongoDB, Mongoose & React.
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <a
              href="http://localhost:4000/api-docs"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}
            >
              Interactive Swagger Docs &nearr;
            </a>
            <span style={{ color: 'var(--text-subtle)' }}>&bull;</span>
            <span style={{ color: 'var(--text-muted)' }}>JWT Authenticated REST API</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
