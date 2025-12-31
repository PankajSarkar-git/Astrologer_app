import { api } from '../client';

export const SessionService = {
  getChatHistory: async (query: string) => {
    const res = await api.get(`/api/v1/chat/history${query}`);
    return res.data;
  },

  getChatMessages: async (query: string) => {
    const res = await api.get(`/api/v1/chat/messages${query}`);
    return res.data;
  },

  getCallHistory: async (query: string) => {
    const res = await api.get(`/api/v1/call/history${query}`);
    return res.data;
  },
  uploadChatImage: async (formData: FormData) => {
    const res = await api.post('/api/v1/chat/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};
