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
};
