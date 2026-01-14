import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  updatePassword: (data) => api.put('/auth/updatepassword', data),
  forgotPassword: (email) => api.post('/auth/forgotpassword', { email }),
  resetPassword: (token, password) => api.put(`/auth/resetpassword/${token}`, { password })
};

// Users API
export const usersAPI = {
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  getEarnings: () => api.get('/users/me/earnings'),
  getStats: () => api.get('/users/me/stats'),
  getMembership: () => api.get('/users/me/membership'),
  requestWithdrawal: (data) => api.post('/users/withdraw', data),
  updateSettings: (data) => api.put('/users/settings', data),
  becomeSeller: () => api.post('/users/become-seller'),
  getFreelancers: (params) => api.get('/users/freelancers', { params }),
  getAll: (params) => api.get('/users', { params })
};

// Projects API
export const projectsAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getOne: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  award: (projectId, bidId) => api.post(`/projects/${projectId}/award/${bidId}`),
  getMyClientProjects: () => api.get('/projects/my/client'),
  getMyFreelancerProjects: () => api.get('/projects/my/freelancer')
};

// Bids API
export const bidsAPI = {
  getProjectBids: (projectId) => api.get(`/bids/project/${projectId}`),
  create: (data) => api.post('/bids', data),
  update: (id, data) => api.put(`/bids/${id}`, data),
  withdraw: (id) => api.delete(`/bids/${id}`),
  getMyBids: () => api.get('/bids/my')
};

// Services API
export const servicesAPI = {
  getAll: (params) => api.get('/services', { params }),
  getOne: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
  getMyServices: () => api.get('/services/my')
};

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getOne: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getMyProducts: () => api.get('/products/my')
};

// Orders API
export const ordersAPI = {
  create: (data) => api.post('/orders', data),
  getMyBuyingOrders: () => api.get('/orders/buying'),
  getMySellingOrders: () => api.get('/orders/selling'),
  getOne: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  submitDelivery: (id, data) => api.post(`/orders/${id}/deliver`, data),
  requestRevision: (id, message) => api.post(`/orders/${id}/revision`, { message }),
  cancel: (id, reason) => api.post(`/orders/${id}/cancel`, { reason })
};

// Messages API
export const messagesAPI = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (otherUserId, params) => api.get(`/messages/conversation/${otherUserId}`, { params }),
  send: (data) => api.post('/messages', data),
  markAsRead: (conversationId) => api.put(`/messages/read/${conversationId}`),
  getUnreadCount: () => api.get('/messages/unread/count'),
  delete: (id) => api.delete(`/messages/${id}`)
};

// Reviews API
export const reviewsAPI = {
  create: (data) => api.post('/reviews', data),
  getUserReviews: (userId, params) => api.get(`/reviews/user/${userId}`, { params }),
  getServiceReviews: (serviceId, params) => api.get(`/reviews/service/${serviceId}`, { params }),
  getProductReviews: (productId, params) => api.get(`/reviews/product/${productId}`, { params }),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
  reply: (id, reply) => api.post(`/reviews/${id}/reply`, { reply })
};

// Categories API
export const categoriesAPI = {
  getAll: (params) => api.get('/categories', { params }),
  getTree: (params) => api.get('/categories/tree', { params }),
  getOne: (id) => api.get(`/categories/${id}`),
  getBySlug: (slug) => api.get(`/categories/slug/${slug}`),
  getPopular: (params) => api.get('/categories/popular', { params })
};

// Payments API
export const paymentsAPI = {
  createPaymentIntent: (data) => api.post('/payments/create-intent', data),
  confirmPayment: (data) => api.post('/payments/confirm', data),
  createMilestonePayment: (data) => api.post('/payments/milestone', data),
  releaseMilestone: (data) => api.post('/payments/release-milestone', data),
  createSubscription: (data) => api.post('/payments/subscription', data),
  confirmSubscription: (data) => api.post('/payments/confirm-subscription', data),
  getHistory: (params) => api.get('/payments/history', { params }),
  getConfig: () => api.get('/payments/config')
};

// Notifications API
export const notificationsAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
  updatePreferences: (data) => api.put('/notifications/preferences', data)
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  suspendUser: (id, data) => api.put(`/admin/users/${id}/suspend`, data),
  getUserWallet: (id) => api.get(`/admin/users/${id}/wallet`),
  updateUserWallet: (id, data) => api.put(`/admin/users/${id}/wallet`, data),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data),
  // Projects
  getProjects: (params) => api.get('/admin/projects', { params }),
  getPendingProjects: () => api.get('/admin/projects/pending'),
  approveProject: (id) => api.put(`/admin/projects/${id}/approve`),
  rejectProject: (id, data) => api.put(`/admin/projects/${id}/reject`, data),
  // Services
  getServices: (params) => api.get('/admin/services', { params }),
  getPendingServices: () => api.get('/admin/services/pending'),
  approveService: (id) => api.put(`/admin/services/${id}/approve`),
  rejectService: (id, data) => api.put(`/admin/services/${id}/reject`, data),
  // Orders & Withdrawals
  getOrders: (params) => api.get('/admin/orders', { params }),
  getPendingWithdrawals: () => api.get('/admin/withdrawals'),
  processWithdrawal: (userId, withdrawalId, data) =>
    api.put(`/admin/withdrawals/${userId}/${withdrawalId}`, data),
  getRevenueReport: (params) => api.get('/admin/reports/revenue', { params })
};

export default api;
