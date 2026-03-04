import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { fetchNotificationsPage, getUnreadNotificationsCount } from "./notifications.client";
import { notificationsKeys } from "./notifications.keys";
import type { NotificationsCursorPage } from "../domain/notifications.schemas";

export const notificationsListOptions = (limit: number) =>
  infiniteQueryOptions<NotificationsCursorPage>({
    queryKey: notificationsKeys.list(limit),
    queryFn: ({ pageParam }) =>
      fetchNotificationsPage({
        cursor: (pageParam as string | null) ?? null,
        limit,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

export const unreadNotificationsCountOptions = () =>
  queryOptions({
    queryKey: notificationsKeys.unreadCount(),
    queryFn: getUnreadNotificationsCount,
  });
