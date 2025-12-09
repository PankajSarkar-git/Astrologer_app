import { api } from '../client';

type GetAllParams = {
  page?: number;
  size?: number;
};

export const BookingService = {
  getAll: async (params?: GetAllParams) => {
    try {
      const page = params?.page ?? 1;
      const size = params?.size ?? 10;

      const res = await api.get('/api/v1/appointment', {
        params: { page, size },
      });
      return res.data;
    } catch (error: any) {
      console.log('BOOKING LIST ERROR =>', error.response?.data);
      throw error;
    }
  },

  updateStatus: async (id: string, status: string) => {
    try {
      const res = await api.patch(`/api/v1/bookings/${id}/status`, {
        status,
      });
      return res.data;
    } catch (error: any) {
      console.log('BOOKING STATUS UPDATE ERROR =>', error.response?.data);
      throw error;
    }
  },
};
