import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

// API Functions
export const authApi = {
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),
    register: (data: { email: string; password: string; name: string; outletName: string }) =>
        api.post('/auth/register', data),
    me: () => api.get('/auth/me'),
};

export const productsApi = {
    getAll: (outletId: string) => api.get(`/products?outletId=${outletId}`),
    getOne: (id: string) => api.get(`/products/${id}`),
    create: (data: any) => api.post('/products', data),
    update: (id: string, data: any) => api.put(`/products/${id}`, data),
    delete: (id: string) => api.delete(`/products/${id}`),
    getHpp: (id: string) => api.get(`/products/${id}/hpp`),
    updatePrices: (id: string, prices: any[]) => api.put(`/products/${id}/prices`, { prices }),
};

export const rawMaterialsApi = {
    getAll: (outletId: string) => api.get(`/raw-materials?outletId=${outletId}`),
    getOne: (id: string) => api.get(`/raw-materials/${id}`),
    create: (data: any) => api.post('/raw-materials', data),
    update: (id: string, data: any) => api.put(`/raw-materials/${id}`, data),
    delete: (id: string) => api.delete(`/raw-materials/${id}`),
    getLowStock: (outletId: string) => api.get(`/raw-materials/alerts/low-stock?outletId=${outletId}`),
};

export const recipesApi = {
    getByProduct: (productId: string) => api.get(`/recipes/product/${productId}`),
    updateByProduct: (productId: string, items: any[]) => api.put(`/recipes/product/${productId}`, { items }),
    addItem: (productId: string, item: any) => api.post(`/recipes/product/${productId}/item`, item),
    deleteItem: (id: string) => api.delete(`/recipes/${id}`),
};

export const customersApi = {
    getAll: (outletId: string) => api.get(`/customers?outletId=${outletId}`),
    getOne: (id: string) => api.get(`/customers/${id}`),
    create: (data: any) => api.post('/customers', data),
    update: (id: string, data: any) => api.put(`/customers/${id}`, data),
    delete: (id: string) => api.delete(`/customers/${id}`),
    getPointsHistory: (id: string) => api.get(`/customers/${id}/points-history`),
    addPoints: (id: string, points: number, description?: string) =>
        api.post(`/customers/${id}/add-points`, { points, description }),
};

export const priceLevelsApi = {
    getAll: (outletId: string) => api.get(`/price-levels?outletId=${outletId}`),
    getOne: (id: string) => api.get(`/price-levels/${id}`),
    create: (data: any) => api.post('/price-levels', data),
    update: (id: string, data: any) => api.put(`/price-levels/${id}`, data),
    delete: (id: string) => api.delete(`/price-levels/${id}`),
};

export const bundlesApi = {
    getAll: (outletId: string) => api.get(`/bundles?outletId=${outletId}`),
    getOne: (id: string) => api.get(`/bundles/${id}`),
    create: (data: any) => api.post('/bundles', data),
    update: (id: string, data: any) => api.put(`/bundles/${id}`, data),
    delete: (id: string) => api.delete(`/bundles/${id}`),
};

export const transactionsApi = {
    getAll: (outletId: string, limit?: number) =>
        api.get(`/transactions?outletId=${outletId}&limit=${limit || 50}`),
    getOne: (id: string) => api.get(`/transactions/${id}`),
    create: (data: any) => api.post('/transactions', data),
    getDailySummary: (outletId: string, date?: string) =>
        api.get(`/transactions/summary/daily?outletId=${outletId}${date ? `&date=${date}` : ''}`),
};

export const reportsApi = {
    getSales: (outletId: string, startDate?: string, endDate?: string) =>
        api.get(`/reports/sales?outletId=${outletId}${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}`),
    getProfitLoss: (outletId: string, startDate?: string, endDate?: string) =>
        api.get(`/reports/profit-loss?outletId=${outletId}${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}`),
    getBalanceSheet: (outletId: string, date?: string) =>
        api.get(`/reports/balance-sheet?outletId=${outletId}${date ? `&date=${date}` : ''}`),
    getHpp: (outletId: string) => api.get(`/reports/hpp?outletId=${outletId}`),
    exportExcel: (outletId: string, type: string, startDate?: string, endDate?: string) =>
        api.get(`/reports/export/excel?outletId=${outletId}&type=${type}${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}`, {
            responseType: 'blob',
        }),
};
