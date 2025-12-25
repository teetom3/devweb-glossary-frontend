import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string; password_confirmation: string }) =>
    api.post('/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/login', data),
  logout: () =>
    api.post('/logout'),
  getUser: () =>
    api.get('/user'),
};

// Categories API
export const categoriesAPI = {
  getAll: () =>
    api.get('/categories'),
  getById: (id: number) =>
    api.get(`/categories/${id}`),
  create: (data: { name: string; description?: string }) =>
    api.post('/categories', data),
  update: (id: number, data: Partial<{ name: string; description: string }>) =>
    api.put(`/categories/${id}`, data),
  delete: (id: number) =>
    api.delete(`/categories/${id}`),
};

// Terms API
export const termsAPI = {
  getAll: (params?: { search?: string; category_id?: number }) =>
    api.get('/terms', { params }),
  getBySlug: (slug: string) =>
    api.get(`/terms/${slug}`),
  incrementView: (slug: string, definitionIds: number[]) =>
    api.post(`/terms/${slug}/view`, { definition_ids: definitionIds }),
  create: (data: { title: string; category_id: number }) =>
    api.post('/terms', data),
  update: (id: number, data: Partial<{ title: string; category_id: number; is_approved: boolean }>) =>
    api.put(`/terms/${id}`, data),
  delete: (id: number) =>
    api.delete(`/terms/${id}`),
};

// Definitions API
export const definitionsAPI = {
  getAll: (params?: { term_id?: number; user_id?: number }) =>
    api.get('/definitions', { params }),
  getById: (id: number) =>
    api.get(`/definitions/${id}`),
  create: (data: { term_id: number; title?: string; explanation: string; code_example?: string; demo_url?: string }) =>
    api.post('/definitions', data),
  update: (id: number, data: Partial<{ title: string; explanation: string; code_example: string; demo_url: string }>) =>
    api.put(`/definitions/${id}`, data),
  delete: (id: number) =>
    api.delete(`/definitions/${id}`),
  approve: (id: number) =>
    api.patch(`/definitions/${id}/approve`),
  getMyDefinitions: () =>
    api.get('/my-definitions'),
  getPending: () =>
    api.get('/pending-definitions'),
};

// Votes API
export const votesAPI = {
  vote: (definitionId: number, value: 1 | -1) =>
    api.post(`/definitions/${definitionId}/vote`, { value }),
  getUserVote: (definitionId: number) =>
    api.get(`/definitions/${definitionId}/my-vote`),
};
