// src/api/hooks/useBooking.ts
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { BookingService } from '../services/booking.service';
import { showToast } from '../../components/common/toast';

type BookingListResponse = {
  msg: string;
  appointments: any[];
  totalItems: number;
  success: boolean;
  isLastPage: boolean;
  totalPages: number;
  currentPage: number;
};

type UpdateStatusPayload = {
  id: string;
  status: string;
};

export function useBookings(size: number = 10) {
  return useInfiniteQuery<BookingListResponse, Error>({
    queryKey: ['bookings', size],
    initialPageParam: 1, // REQUIRED in v5
    queryFn: ({ pageParam }) =>
      BookingService.getAll({
        page: pageParam as number,
        size,
      }),
    getNextPageParam: lastPage => {
      if (!lastPage) return undefined;
      if (lastPage.isLastPage) return undefined;

      const current = lastPage.currentPage ?? 1;
      return current + 1;
    },
    //refetchInterval: 2000,
    refetchIntervalInBackground: false,
  });
}
export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      otp = null,
    }: {
      id: string;
      status: string;
      otp?: number | null;
    }) => BookingService.updateStatus(id, { status, otp } as any),

    onSuccess: res => {
      showToast({
        message: res?.msg || 'Status updated successfully',
        type: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },

    onError: (err: any) => {
      const msg =
        err?.response?.data?.msg || err?.message || 'Failed to update status';

      showToast({ message: msg, type: 'error' });
    },
  });
}
