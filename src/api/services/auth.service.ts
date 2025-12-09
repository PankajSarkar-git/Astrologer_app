import { api } from '../client';

export const AuthService = {
  login: async (number: string, password: string) => {
    try {
      const response = await api.post('api/v1/auth/login-by-password', {
        mobile: number,
        password,
      });
      console.log('API LOGIN RESPONSE ===>', response.data);
      return response.data;
    } catch (error: any) {
      console.log('API LOGIN ERROR ===>', error.response?.data);
      throw error;
    }
  },

  register: async (fullName: string, number: string, password: string) => {
    try {
      const res = await api.post('/api/v1/auth/register', {
        name: fullName,
        mobile: number,
        password,
      });

      console.log('REGISTER SUCCESS ===>', res.data);
      return res.data;
    } catch (error: any) {
      console.log('REGISTER ERROR ===>', error?.response?.data || error);
      throw error; // so react-query mutation can catch it
    }
  },

  getCurrentUser: async () => {
    const res = await api.get('/auth/me');
    return res.data; // user object
  },

  logout: async () => {
    const res = await api.post('/auth/logout');
    return res.data;
  },
};
