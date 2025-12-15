import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { PostService } from '../services/post.service';
import { showToast } from '../../components/common/toast';

export function usePosts(size: number = 10) {
  return useInfiniteQuery({
    queryKey: ['posts', size],
    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      PostService.getAll({
        page: pageParam as number,
        size,
      }),

    getNextPageParam: lastPage => {
      if (!lastPage) return undefined;
      if (lastPage.isLastPage) return undefined;

      const current = lastPage.currentPage ?? 1;
      return current + 1;
    },
  });
}

/* ---------------- CREATE ---------------- */

export function useCreatePost(options?: { onSuccess?: () => void }) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => PostService.create(payload),

    onSuccess: res => {
      showToast({ type: 'success', message: res?.msg || 'Post created' });
      options?.onSuccess?.();
      client.invalidateQueries({ queryKey: ['posts'] });
    },

    onError: (err: any) => {
      showToast({
        type: 'error',
        message: err?.response?.data?.msg || 'Failed to create post',
      });
    },
  });
}

/* ---------------- UPDATE ---------------- */

export function useUpdatePost() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      PostService.update(id, payload),

    onSuccess: res => {
      showToast({ type: 'success', message: res?.msg || 'Updated' });
      client.invalidateQueries({ queryKey: ['posts'] });
      client.invalidateQueries({ queryKey: ['post'] }); // safety
    },

    onError: (err: any) => {
      showToast({
        type: 'error',
        message: err?.response?.data?.msg || 'Update failed',
      });
    },
  });
}

/* ---------------- DELETE ---------------- */

export function useDeletePost() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => PostService.delete(id),

    onSuccess: res => {
      showToast({ type: 'success', message: res?.msg || 'Deleted' });
      client.invalidateQueries({ queryKey: ['posts'] });
    },

    onError: (err: any) => {
      showToast({
        type: 'error',
        message: err?.response?.data?.msg || 'Delete failed',
      });
    },
  });
}

/* ---------------- READ SINGLE (ADD THIS) ---------------- */

export function usePostDetail(id?: string) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => PostService.getById(id as string),
    enabled: !!id,
  });
}
