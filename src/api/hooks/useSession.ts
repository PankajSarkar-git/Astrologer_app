import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { SessionService } from '../services/session.service';

/* ---------------- CHAT HISTORY ---------------- */

export function useChatHistory(query: string, enabled = true) {
  return useQuery({
    queryKey: ['chat-history', query],
    queryFn: () => SessionService.getChatHistory(query),
    enabled,
  });
}

/* ---------------- CHAT MESSAGES (PAGINATED) ---------------- */

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
  });
}

/* ---------------- CALL HISTORY ---------------- */

export function useCallHistory(query: string, enabled = true) {
  return useQuery({
    queryKey: ['call-history', query],
    queryFn: () => SessionService.getCallHistory(query),
    enabled,
  });
}
