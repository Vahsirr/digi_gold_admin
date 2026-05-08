import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://jewel-production-7efe.up.railway.app/api';
// const API_BASE_URL = 'http://localhost:3001/api'
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Admin endpoints
export const fetchDashboardStats = (t) => api.get(`/admin/dashboard${t ? `?t=${t}` : ''}`);
export const fetchUsers = () => api.get('/admin/users');
export const updateUser = (id, data) => api.patch(`/admin/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const fetchReferrals = () => api.get('/admin/referrals');
export const fetchPayments = () => api.get('/admin/payments');
export const fetchTransactions = (t) => api.get(`/admin/transactions${t ? `?t=${t}` : ''}`);
export const fetchReminders = (t) => api.get(`/admin/reminders${t ? `?t=${t}` : ''}`);
export const notifyUser = (userId) => api.post(`/admin/users/${userId}/notify-missed-plan`);

// Booking / Order endpoints
export const fetchBookings = () => api.get('/admin/bookings');
export const updateBookingStatus = (id, status) => api.patch(`/admin/bookings/${id}/status`, { status });
export const refundPayment = (id) => api.post(`/admin/payments/${id}/refund`);

// Price endpoints
export const fetchGoldPrice = () => api.get('/gold/price');
export const fetchSilverPrice = () => api.get('/silver/price');

export const fetchMetalPrices = () => api.get('/admin/metal-prices');
export const updateMetalPrices = (data) => api.post('/admin/metal-prices', data);

export default api;