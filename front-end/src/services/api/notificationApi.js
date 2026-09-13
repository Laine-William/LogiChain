import apiClient from './clientApi';

export const notificationApi = {
  getAll: async () => {
    const response = await apiClient.get('/notifications');
    return response.data;
  },
  getByUser: async (userId) => {
    const response = await apiClient.get(`/notifications/user/${userId}`);
    return response.data;
  },
  getByType: async (type) => {
    const response = await apiClient.get(`/notifications/type/${type}`);
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post('/notifications', data);
    return response.data;
  },
  updateType: async (id, type) => {
    const response = await apiClient.patch(`/notifications/${id}/type`, { type });
    return response.data;
  },
  markAsRead: async (userId, id) => {
    const response = await apiClient.patch(`/notifications/user/${userId}/read/${id}`);
    return response.data;
  },
  markAllAsRead: async (userId) => {
    const response = await apiClient.patch(`/notifications/user/${userId}/read-all`);
    return response.data;
  },
};