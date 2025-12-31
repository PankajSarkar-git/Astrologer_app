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
      // Component-specific success callback
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

/* ---------------- LIKE / UNLIKE ---------------- */

export function useLikePost() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, status }: { postId: string; status: string }) =>
      PostService.like(postId, status),

    onMutate: async ({ postId }) => {
      await client.cancelQueries({ queryKey: ['posts'] });

      const previous = client.getQueryData(['posts']);

      client.setQueryData(['posts'], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((post: any) =>
              post.id === postId
                ? {
                    ...post,
                    liked: !post.liked,
                    likesCount: post.liked
                      ? post.likesCount - 1
                      : post.likesCount + 1,
                  }
                : post,
            ),
          })),
        };
      });

      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        client.setQueryData(['posts'], ctx.previous);
      }
      showToast({ type: 'error', message: 'Failed to like post' });
    },

    onSettled: () => {
      client.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

/* ---------------- GET COMMENTS ---------------- */

export function usePostComments(postId: string, size: number = 10) {
  return useInfiniteQuery({
    queryKey: ['post-comments', postId],
    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      PostService.getComments(postId, pageParam as number, size),

    getNextPageParam: lastPage => {
      if (!lastPage) return undefined;

      const comments = lastPage.comments ?? [];
      if (comments.length === 0) return undefined;

      if (lastPage.last === true) return undefined;

      return (lastPage.currentPage ?? 1) + 1;
    },
  });
}

/* ---------------- ADD COMMENT ---------------- */

export function useAddComment(postId: string) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (comment: string) => PostService.addComment(postId, comment),

    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ['post-comments', postId],
      });
    },

    onError: () => {
      showToast({
        type: 'error',
        message: 'Failed to add comment',
      });
    },
  });
}
/* ---------------- DELETE COMMENT ---------------- */

export function useDeleteComment(postId: string) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => PostService.deleteComment(commentId),

    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ['post-comments', postId],
      });
    },

    onError: () => {
      showToast({
        type: 'error',
        message: 'Failed to delete comment',
      });
    },
  });
}
