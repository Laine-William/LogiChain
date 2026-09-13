import apiClient from './clientApi';

export const stepLogisticApi = {
  getAllByLogisticId: async (logisticId) => {
    const response = await apiClient.get(`/logistics/${logisticId}/steps`);
    return response.data;
  },
  getById: async (logisticId, stepId) => {
    const response = await apiClient.get(`/logistics/${logisticId}/steps/${stepId}`);
    return response.data;
  },
  getByStatus: async (logisticId, status) => {
    const response = await apiClient.get(`/logistics/${logisticId}/steps/status/${status}`);
    return response.data;
  },
  create: async (logisticId, data) => {
    const response = await apiClient.post(`/logistics/${logisticId}/steps`, data);
    return response.data;
  },
  update: async (logisticId, stepId, data) => {
    const response = await apiClient.put(`/logistics/${logisticId}/steps/${stepId}`, data);
    return response.data;
  },
  patch: async (logisticId, stepId, data) => {
    const response = await apiClient.patch(`/logistics/${logisticId}/steps/${stepId}`, data);
    return response.data;
  },
  updateStatus: async (logisticId, stepId, status) => {
    const response = await apiClient.patch(`/logistics/${logisticId}/steps/${stepId}/status`, { status });
    return response.data;
  },
  delete: async (logisticId, stepId) => {
    const response = await apiClient.delete(`/logistics/${logisticId}/steps/${stepId}`);
    return response.data;
  },
};