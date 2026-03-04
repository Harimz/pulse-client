import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/auth/state/auth.store";
import { fetchNotificationsPage, getUnreadNotificationsCount } from "./notifications.client";
import { notificationsKeys } from "./notifications.keys";

export const useNotificationsInfinite = (limit = 20) => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const status = useAuthStore((s) => s.status);

  return useInfiniteQuery({
    queryKey: notificationsKeys.list(limit),
    enabled: status === "ready" && !!accessToken,
    queryFn: ({ pageParam }) =>
      fetchNotificationsPage({ cursor: pageParam ?? null, limit }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 10_000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
};

export const useUnreadNotificationsCount = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const status = useAuthStore((s) => s.status);

  return useQuery({
    queryKey: notificationsKeys.unreadCount(),
    enabled: status === "ready" && !!accessToken,
    queryFn: getUnreadNotificationsCount,
    staleTime: 10_000,
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
  });
};
