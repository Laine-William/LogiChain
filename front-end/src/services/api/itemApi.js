import apiClient from './clientApi';

export const itemApi = {
  getAll: async () => {
    const response = await apiClient.get('/items');
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/items/${id}`);
    return response.data;
  },
  getByStatus: async (status) => {
    const response = await apiClient.get(`/items/status/${status}`);
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post('/items', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/items/${id}`, data);
    return response.data;
  },
  patch: async (id, data) => {
    const response = await apiClient.patch(`/items/${id}`, data);
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await apiClient.patch(`/items/${id}/status`, { status });
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/items/${id}`);
    return response.data;
  },
};