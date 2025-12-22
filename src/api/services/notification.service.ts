import { api } from '../client';

export const NotificationService = {
  getNotifications: async ({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }) => {
    const res = await api.get(
      `/api/v1/notifications?page=${page}&size=${limit}`,
    );
    return res.data;
  },

  markNotificationRead: async (id: string) => {
    const res = await api.put(`/api/v1/notifications/read/${id}`);
    return res.data;
  },
};
