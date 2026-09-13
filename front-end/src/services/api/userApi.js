import apiClient from './clientApi';

export const userApi = {
  login: async (credentials) => {
    const response = await apiClient.post('/users/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await apiClient.post('/users/register', userData);
    return response.data;
  },
  getAll: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },
  getByRole: async (role) => {
    const response = await apiClient.get(`/users/role/${role}`);
    return response.data;
  },
  getByAccountStatus: async (status) => {
    const response = await apiClient.get(`/users/account/${status}`);
    return response.data;
  },
  getByAvailability: async (status) => {
    const response = await apiClient.get(`/users/availability/${status}`);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  },
  patch: async (id, data) => {
    const response = await apiClient.patch(`/users/${id}`, data);
    return response.data;
  },
  updateAccountStatus: async (id, accountStatus) => {
    const response = await apiClient.patch(`/users/${id}/status`, { accountStatus });
    return response.data;
  },
  updateAvailability: async (id, availability) => {
    const response = await apiClient.patch(`/users/${id}/availability`, { availability });
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },
};