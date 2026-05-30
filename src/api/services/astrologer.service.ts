import { Form } from '../../screens/profile/pofile-edit';
import { api } from '../client';

type GetAstrologersParams = {
  page?: number;
  size?: number;
};

export const AstrologerService = {
  /* -------- LIST -------- */
  getAll: async (params?: GetAstrologersParams) => {
    const page = params?.page ?? 1;
    const size = params?.size ?? 10;

    const res = await api.get('/api/v1/astrologers', {
      params: { page, size },
    });

    return res.data;
  },

  /* -------- READ SINGLE -------- */
  getById: async (id: string) => {
    const res = await api.get(`/api/v1/astrologers/${id}`);
    return res.data;
  },

  /*------------- me -------------*/
  getMe: async () => {
    const res = await api.get(`/api/v1/users`);
    return res.data;
  },

  /* -------- UPDATE DETAILS -------- */
  updateDetails: async (id: string, payload: Form) => {
    console.log('[updateAstrologer] id:', id);

    try {
      const res = await api.put(`/api/v1/astrologers/${id}`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('[updateAstrologer] success');
      return res.data;
    } catch (err: any) {
      console.log(
        '[updateAstrologer] failed:',
        err?.response?.status || err?.message,
      );
      throw err;
    }
  },

  /* -------- CHANGE ONLINE STATUS -------- */
  changeOnline: async (data: {
    onlineType: 'CHATONLINE' | 'AUDIOONLINE' | 'VIDEOONLINE';
    status: boolean;
  }) => {
    const res = await api.post('/api/v1/astrologers/change-online', data);
    return res.data;
  },
  updateProfilePic: async (id: string, file: any) => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await api.post(
      `/api/v1/astrologers/profile-pic/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return res.data;
  },
};
