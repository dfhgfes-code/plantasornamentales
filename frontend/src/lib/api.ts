import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: agregar token JWT automáticamente
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;

      // Limpiar token expirado del localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Limpiar también el store de Zustand (auth-storage)
      try {
        const stored = localStorage.getItem('auth-storage');
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.state = { ...parsed.state, user: null, token: null, isAuthenticated: false };
          localStorage.setItem('auth-storage', JSON.stringify(parsed));
        }
      } catch {}

      // Solo redirigir a login si estamos en una página estrictamente privada
      const requiresAuth =
        currentPath.startsWith('/perfil') ||
        currentPath.startsWith('/checkout') ||
        currentPath.startsWith('/admin');

      if (requiresAuth) {
        window.location.href = '/login';
      }
      // En cualquier otra página: solo limpiamos el token silenciosamente
    }
    return Promise.reject(error);
  },
);

export default api;

// ─── Servicios ───────────────────────────────────────────────

export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  googleLogin: (data: { token: string }) => api.post('/auth/google', data),
  getProfile: () => api.get('/auth/profile'),
  changePassword: (data: any) => api.patch('/auth/change-password', data),
};

export const productsApi = {
  getAll: (params?: any) => api.get('/products', { params }),
  getOne: (id: string) => api.get(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.patch(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
  toggleAvailability: (id: string) => api.patch(`/products/${id}/toggle-availability`),
  updateStock: (id: string, quantity: number) => api.patch(`/products/${id}/stock`, { quantity }),
};

export const plansApi = {
  getAll: (onlyActive = false) => api.get(`/plans${onlyActive ? '?onlyActive=true' : ''}`),
  getOne: (id: string) => api.get(`/plans/${id}`),
  create: (data: any) => api.post('/plans', data),
  update: (id: string, data: any) => api.patch(`/plans/${id}`, data),
  delete: (id: string) => api.delete(`/plans/${id}`),
};

export const settingsApi = {
  getAll: () => api.get(`/settings?t=${Date.now()}`),
  update: (data: Record<string, string>) => api.patch('/settings', data),
};

export const recipientsApi = {
  getAll: () => api.get('/recipients'),
  create: (data: any) => api.post('/recipients', data),
  update: (id: string, data: any) => api.patch(`/recipients/${id}`, data),
  delete: (id: string) => api.delete(`/recipients/${id}`),
  setDefault: (id: string) => api.patch(`/recipients/${id}/set-default`),
};

export const subscriptionsApi = {
  getMine: () => api.get('/subscriptions/my'),
  getAll: (params?: any) => api.get('/subscriptions', { params }),
  getOne: (id: string) => api.get(`/subscriptions/${id}`),
  create: (data: any) => api.post('/subscriptions', data),
  update: (id: string, data: any) => api.patch(`/subscriptions/${id}`, data),
  pause: (id: string) => api.patch(`/subscriptions/${id}/pause`),
  resume: (id: string) => api.patch(`/subscriptions/${id}/resume`),
  cancel: (id: string, data?: any) => api.patch(`/subscriptions/${id}/cancel`, data),
};

export const ordersApi = {
  getMine: (params?: any) => api.get('/orders/my', { params }),
  getAll: (params?: any) => api.get('/orders', { params }),
  getOne: (id: string) => api.get(`/orders/${id}`),
  create: (data: any) => api.post('/orders', data),
  updateStatus: (id: string, data: any) => api.patch(`/orders/${id}/status`, data),
  cancel: (id: string) => api.patch(`/orders/${id}/cancel`),
};

export const paymentsApi = {
  initiate: (data: any) => api.post('/payments', data),
  getMine: (params?: any) => api.get('/payments/my', { params }),
  getAll: (params?: any) => api.get('/payments', { params }),
  getStatus: (id: string) => api.get(`/payments/${id}/status`),
};

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getSuperAnalytics: () => api.get('/admin/super-analytics'),
  getUsers: (params?: any) => api.get('/users', { params }),
  toggleUserActive: (id: string) => api.patch(`/users/${id}/toggle-active`),
  createAdmin: (data: any) => api.post('/users/create-admin', data),
};
