import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { SessionService } from '../services/session.service';

/* ---------------- CHAT HISTORY (NO CACHE) ---------------- */

export function useChatHistory(query: string, enabled = true) {
  return useQuery({
    queryKey: ['chat-history', query],
    queryFn: () => SessionService.getChatHistory(query),
    enabled,

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: false,
  });
}

/* ---------------- CHAT MESSAGES (PAGINATED, NO RETENTION) ---------------- */

export function useChatMessages(query: string, enabled = true) {
  return useInfiniteQuery({
    queryKey: ['chat-messages', query],
    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      SessionService.getChatMessages(`${query}?page=${pageParam}&size=15`),

    getNextPageParam: lastPage => {
      if (!lastPage || lastPage.last) return undefined;
      return (lastPage.currentPage ?? 1) + 1;
    },

    enabled,

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: false,
  });
}

/* ---------------- CALL HISTORY (NO CACHE) ---------------- */

export function useCallHistory(query: string, enabled = true) {
  return useQuery({
    queryKey: ['call-history', query],
    queryFn: () => SessionService.getCallHistory(query),
    enabled,

    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: false,
  });
}

/* ---------------- UPLOAD IMAGE ---------------- */

export function useUploadChatImage() {
  return useMutation({
    mutationFn: (formData: FormData) =>
      SessionService.uploadChatImage(formData),
    retry: false,
  });
}
