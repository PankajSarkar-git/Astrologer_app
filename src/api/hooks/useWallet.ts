// import {
//   useInfiniteQuery,
//   useMutation,
//   useQueryClient,
// } from '@tanstack/react-query';
// import { WalletService } from '../services/wallet.service';
// import { showToast } from '../../components/common/toast';

// /* ================= TRANSACTIONS ================= */

// export function useWalletTransactions() {
//   return useInfiniteQuery({
//     queryKey: ['wallet-transactions'],
//     initialPageParam: 1,

//     queryFn: ({ pageParam }) =>
//       WalletService.getTransactions({
//         page: pageParam as number,
//       }),

//     getNextPageParam: lastPage => {
//       if (!lastPage || lastPage.isLastPage) return undefined;
//       return lastPage.currentPage + 1;
//     },
//   });
// }

// /* ================= WITHDRAW ================= */

// export function useWithdraw() {
//   const client = useQueryClient();

//   return useMutation({
//     mutationFn: (amount: number) => WalletService.withdraw(amount),

//     onSuccess: res => {
//       showToast({
//         type: 'success',
//         message: res?.msg || 'Withdrawal requested',
//       });

//       client.invalidateQueries({ queryKey: ['wallet-transactions'] });
//     },

//     onError: (err: any) => {
//       showToast({
//         type: 'error',
//         message: err?.response?.data?.msg || 'Withdrawal request failed',
//       });
//     },
//   });
// }

// /* ================= TOP UP (USER ONLY) ================= */

// export function useTopUp() {
//   const client = useQueryClient();

//   return useMutation({
//     mutationFn: (amount: number) => WalletService.topUp(amount),

//     onSuccess: () => {
//       client.invalidateQueries({ queryKey: ['wallet-transactions'] });
//     },

//     onError: (err: any) => {
//       showToast({
//         type: 'error',
//         message: err?.response?.data?.msg || 'Top-up failed',
//       });
//     },
//   });
// }

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { WalletService } from '../services/wallet.service';
import { showToast } from '../../components/common/toast';

/* ================= TRANSACTIONS ================= */

export function useWalletTransactions() {
  return useInfiniteQuery({
    queryKey: ['wallet-transactions'],
    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      WalletService.getTransactions({
        page: pageParam as number,
      }),

    getNextPageParam: lastPage => {
      if (!lastPage || lastPage.isLastPage) return undefined;
      return lastPage.currentPage + 1;
    },

    // 🔥 kill caching
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

/* ================= WITHDRAW ================= */

export function useWithdraw() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (amount: number) => WalletService.withdraw(amount),

    onSuccess: res => {
      showToast({
        type: 'success',
        message: res?.msg || 'Withdrawal requested',
      });

      // forced refetch, no cache reuse
      client.invalidateQueries({
        queryKey: ['wallet-transactions'],
        refetchType: 'active',
      });
    },

    onError: (err: any) => {
      showToast({
        type: 'error',
        message: err?.response?.data?.msg || 'Withdrawal request failed',
      });
    },
  });
}

/* ================= TOP UP ================= */

export function useTopUp() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (amount: number) => WalletService.topUp(amount),

    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ['wallet-transactions'],
        refetchType: 'active',
      });
    },

    onError: (err: any) => {
      showToast({
        type: 'error',
        message: err?.response?.data?.msg || 'Top-up failed',
      });
    },
  });
}
