import { api } from '../client';

type GetPostsParams = {
  page?: number;
  size?: number;
};

export const PostService = {
  getAll: async (params?: GetPostsParams) => {
    const page = params?.page ?? 1;
    const size = params?.size ?? 10;

    const res = await api.get('/api/v1/posts', {
      params: { page, size },
    });
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get(`/api/v1/posts/${id}`);
    return res.data;
  },

  create: async (formData: FormData) => {
    const res = await api.post('/api/v1/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  update: async (id: string, formData: FormData) => {
    const res = await api.put(`/api/v1/posts/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/api/v1/posts/${id}`);
    return res.data;
  },

  deleteImage: async (imageId: string) => {
    const res = await api.delete(`/api/v1/posts/image/${imageId}`);
    return res.data;
  },
  /* ----------------------------------------
     LIKE / UNLIKE POST
  ---------------------------------------- */
  like: async (postId: string, status: string) => {
    const res = await api.put(`/api/v1/posts/${postId}/likes`, {
      status,
    });
    return res.data;
  },

  /* ----------------------------------------
     ADD COMMENT
  ---------------------------------------- */
  addComment: async (postId: string, comment: string) => {
    const res = await api.post(`/api/v1/posts/${postId}/comments`, {
      comment,
    });
    return res.data;
  },

  /* ----------------------------------------
     DELETE COMMENT
  ---------------------------------------- */
  deleteComment: async (commentId: string) => {
    const res = await api.delete(`/api/v1/posts/comments/${commentId}`);
    return res.data;
  },

  /* ----------------------------------------
     GET COMMENTS (PAGINATED)
  ---------------------------------------- */
  getComments: async (postId: string, page: number, size: number) => {
    const res = await api.get(`/api/v1/posts/${postId}/comments`, {
      params: { page, size },
    });
    return res.data;
  },
};
