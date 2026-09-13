import apiClient from './clientApi';

export const logisticApi = {
  getAll: async () => {
    const response = await apiClient.get('/logistics');
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/logistics/${id}`);
    return response.data;
  },
  getByStatus: async (status) => {
    const response = await apiClient.get(`/logistics/status/${status}`);
    return response.data;
  },
  getByEvent: async (eventId) => {
    const response = await apiClient.get(`/logistics/event/${eventId}`);
    return response.data;
  },
  getCarbonImpact: async (id) => {
    const response = await apiClient.get(`/logistics/${id}/carbon-impact`);
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post('/logistics', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/logistics/${id}`, data);
    return response.data;
  },
  patch: async (id, data) => {
    const response = await apiClient.patch(`/logistics/${id}`, data);
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await apiClient.patch(`/logistics/${id}/status`, { status });
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/logistics/${id}`);
    return response.data;
  },
};