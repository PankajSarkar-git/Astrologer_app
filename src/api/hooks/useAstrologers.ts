import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AstrologerService } from '../services/astrologer.service';
import { showToast } from '../../components/common/toast';

type UpdateAstrologerPayload = {
  id: string;
  payload: {
    name: string;
    mobile: string;
    expertise: string;
    experienceYears: string;
    pricePerMinuteChat: string;
    pricePerMinuteVoice: string;
    pricePerMinuteVideo: string;
    about: string;
  };
};

/* ---------------- LIST ---------------- */

export function useAstrologers(size: number = 10) {
  return useInfiniteQuery({
    queryKey: ['astrologers', size],
    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      AstrologerService.getAll({
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

/* ---------------- READ SINGLE ---------------- */

export function useAstrologerDetail(id?: string) {
  return useQuery({
    queryKey: ['astrologer', id],
    queryFn: () => AstrologerService.getById(id as string),
    enabled: !!id,
  });
}
/* ---------------- GET ME ---------------- */

export function useGetMe(enabled: boolean) {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => AstrologerService.getMe(),
    enabled,
    retry: false,
  });
}

/* ---------------- UPDATE DETAILS ---------------- */

export function useUpdateAstrologer() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateAstrologerPayload) =>
      AstrologerService.updateDetails(id, payload),

    retry: false, // IMPORTANT for multipart uploads

    onSuccess: res => {
      showToast({
        type: 'success',
        message: res?.msg || 'Details updated',
      });

      // keep cache consistent
      client.invalidateQueries({ queryKey: ['astrologers'] });
      client.invalidateQueries({ queryKey: ['astrologer'] });
    },

    onError: (err: any) => {
      // Network error -> no response object
      const message =
        err?.response?.data?.msg ||
        err?.message ||
        'Network error. Please try again.';

      showToast({
        type: 'error',
        message,
      });
    },
  });
}

/* ---------------- CHANGE ONLINE STATUS ---------------- */

export function useChangeAstrologerOnline() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (isOnline: boolean) => AstrologerService.changeOnline(isOnline),

    onSuccess: res => {
      showToast({
        type: 'success',
        message: res?.msg || 'Status updated',
      });

      client.invalidateQueries({ queryKey: ['astrologers'] });
      client.invalidateQueries({ queryKey: ['astrologer'] });
    },

    onError: (err: any) => {
      showToast({
        type: 'error',
        message: err?.response?.data?.msg || 'Failed to update status',
      });
    },
  });
}

/* ---------------- UPDATE PROFILE PIC ---------------- */

export function useUpdateAstrologerProfilePic() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: any }) =>
      AstrologerService.updateProfilePic(id, file),

    retry: false,

    onSuccess: res => {
      showToast({
        type: 'success',
        message: res?.msg || 'Profile picture updated',
      });

      // 🔥 keep all related data in sync
      client.invalidateQueries({ queryKey: ['me'] });
      client.invalidateQueries({ queryKey: ['astrologer'] });
      client.invalidateQueries({ queryKey: ['astrologers'] });
    },

    onError: (err: any) => {
      const message =
        err?.response?.data?.msg ||
        err?.message ||
        'Failed to update profile picture';

      showToast({
        type: 'error',
        message,
      });
    },
  });
}
