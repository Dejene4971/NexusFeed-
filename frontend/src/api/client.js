import axios from 'axios';

// When running with Vite dev server proxy or configured base URL
const BASE_URL = import.meta.env.VITE_API_URL || '';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach JWT token automatically if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Standardize error responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';
    return Promise.reject(new Error(message));
  }
);

// Auth API Endpoints
export const authApi = {
  register: async (userData) => {
    const res = await apiClient.post('/api/v1/users/register', userData);
    return res.data;
  },
  login: async (credentials) => {
    const res = await apiClient.post('/api/v1/users/login', credentials);
    return res.data;
  },
  logout: async () => {
    try {
      const res = await apiClient.post('/api/v1/users/logout');
      return res.data;
    } catch {
      // Even if network fails, client logout proceeds
      return { success: true };
    }
  },
};

// Posts API Endpoints
export const postsApi = {
  getPosts: async ({ page = 1, limit = 9, search = '', sort = 'newest' } = {}) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search.trim()) params.append('search', search.trim());
    if (sort) params.append('sort', sort);

    const res = await apiClient.get(`/api/v1/posts/getPosts?${params.toString()}`);
    return res.data;
  },

  getPostById: async (id) => {
    const res = await apiClient.get(`/api/v1/posts/${id}`);
    return res.data;
  },

  createPost: async (postData) => {
    const res = await apiClient.post('/api/v1/posts/create', postData);
    return res.data;
  },

  updatePost: async (id, postData) => {
    const res = await apiClient.patch(`/api/v1/posts/updatePost/${id}`, postData);
    return res.data;
  },

  deletePost: async (id) => {
    const res = await apiClient.delete(`/api/v1/posts/deletePost/${id}`);
    return res.data;
  },
};

// System Health API
export const healthApi = {
  check: async () => {
    const start = Date.now();
    const res = await apiClient.get('/health');
    const latency = Date.now() - start;
    return { ...res.data, latency };
  },
};
