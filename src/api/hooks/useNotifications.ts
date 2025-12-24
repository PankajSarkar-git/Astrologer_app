// import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
// import { NotificationService } from '../services/notification.service';

// /* ---------------- NOTIFICATIONS (PAGINATED) ---------------- */

// export function useNotifications(enabled = true) {
//   return useInfiniteQuery({
//     queryKey: ['notifications'],
//     initialPageParam: 1,

//     queryFn: ({ pageParam }) =>
//       NotificationService.getNotifications({
//         page: pageParam,
//         limit: 10,
//       }),

//     getNextPageParam: lastPage => {
//       if (!lastPage || lastPage.last) return undefined;
//       return (lastPage.currentPage ?? 1) + 1;
//     },

//     enabled,

//     staleTime: 0,
//     gcTime: 0,
//     refetchOnMount: true,
//     refetchOnWindowFocus: false,
//     refetchOnReconnect: true,
//   });
// }

// /* ---------------- MARK NOTIFICATION READ ---------------- */

// export function useMarkNotificationRead() {
//   return useMutation({
//     mutationFn: (id: string) => NotificationService.markNotificationRead(id),
//   });
// }

import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { NotificationService } from '../services/notification.service';

/* ---------------- NOTIFICATIONS (NO CACHE) ---------------- */

export function useNotifications(enabled = true) {
  return useInfiniteQuery({
    queryKey: ['notifications'],
    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      NotificationService.getNotifications({
        page: pageParam,
        limit: 10,
      }),

    getNextPageParam: lastPage => {
      if (!lastPage || lastPage.last) return undefined;
      return (lastPage.currentPage ?? 1) + 1;
    },

    enabled,

    // 🔥 NO CACHE SETTINGS
    staleTime: 0, // data is instantly stale
    gcTime: 0, // cache removed immediately
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: false,
  });
}

/* ---------------- MARK NOTIFICATION READ ---------------- */

export function useMarkNotificationRead() {
  return useMutation({
    mutationFn: (id: string) => NotificationService.markNotificationRead(id),
    retry: false,
  });
}
