import { api } from './axiosClient';
import type { DashboardSummary, Order, Pagination, Product, User } from '../types';

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ user: User; accessToken: string }>('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post<{ user: User; accessToken: string }>('/auth/register', { name, email, password }),
  refresh: () => api.post<{ user: User; accessToken: string }>('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
  me: () => api.get<{ user: User }>('/auth/me'),
};

export const productsApi = {
  list: (params: Record<string, unknown>) =>
    api.get<{ data: Product[]; pagination: Pagination }>('/products', { params }),
  create: (body: Record<string, unknown>) => api.post<{ data: Product }>('/products', body),
  lowStock: () => api.get<{ data: Product[] }>('/products/low-stock'),
};

export const ordersApi = {
  list: (params: Record<string, unknown>) =>
    api.get<{ data: Order[]; pagination: Pagination }>('/orders', { params }),
  create: (body: Record<string, unknown>) => api.post<{ data: Order }>('/orders', body),
  updateStatus: (id: number, status: string) =>
    api.patch<{ data: Order }>(`/orders/${id}/status`, { status }),
};

export const dashboardApi = {
  summary: () => api.get<{ data: DashboardSummary }>('/dashboard/summary'),
};
