import apiClient from './clientApi';

export const anomalyApi = {
  getAll: async () => {
    const response = await apiClient.get('/anomalies');
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/anomalies/${id}`);
    return response.data;
  },
  getByEvent: async (eventId) => {
    const response = await apiClient.get(`/anomalies/event/${eventId}`);
    return response.data;
  },
  getNearby: async (latitude, longitude, radius) => {
    const response = await apiClient.get('/anomalies/nearby', {
      params: { latitude, longitude, radius },
    });
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post('/anomalies', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/anomalies/${id}`, data);
    return response.data;
  },
  patch: async (id, data) => {
    const response = await apiClient.patch(`/anomalies/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/anomalies/${id}`);
    return response.data;
  },
};