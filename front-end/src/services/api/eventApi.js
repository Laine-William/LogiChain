import apiClient from './clientApi';

export const eventApi = {
  getAll: async () => {
    const response = await apiClient.get('/events');
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/events/${id}`);
    return response.data;
  },
  getByUser: async (userId) => {
    const response = await apiClient.get(`/events/users/${userId}`);
    return response.data;
  },
  getByStatus: async (status) => {
    const response = await apiClient.get(`/events/status/${status}`);
    return response.data;
  },
  getStats: async () => {
    const response = await apiClient.get('/events/stats');
    return response.data;
  },
  getUserStats: async (userId) => {
    const response = await apiClient.get(`/events/stats/users/${userId}`);
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post('/events', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/events/${id}`, data);
    return response.data;
  },
  patch: async (id, data) => {
    const response = await apiClient.patch(`/events/${id}`, data);
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await apiClient.patch(`/events/${id}/status`, { status });
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/events/${id}`);
    return response.data;
  },
};