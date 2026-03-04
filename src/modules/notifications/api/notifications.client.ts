import { createApiClient } from "@/shared/api/api-client";
import { useAuthStore } from "@/modules/auth/state/auth.store";
import {
  notificationsCursorPageSchema,
  unreadCountSchema,
  type NotificationsCursorPage,
} from "../domain/notifications.schemas";

const getApi = () => {
  const accessToken = useAuthStore.getState().accessToken;
  const setAccessToken = useAuthStore.getState().setAccessToken;

  return createApiClient({
    getAccessToken: () => accessToken,
    setAccessToken,
  });
};

export const fetchNotificationsPage = async (args: {
  cursor?: string | null;
  limit: number;
}): Promise<NotificationsCursorPage> => {
  const api = getApi();
  const qs = new URLSearchParams();
  qs.set("limit", String(args.limit));
  if (args.cursor) qs.set("cursor", args.cursor);

  const data = await api.requestJson<NotificationsCursorPage>(
    `/api/v1/notifications?${qs.toString()}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  return notificationsCursorPageSchema.parse(data);
};

export const getUnreadNotificationsCount = async (): Promise<number> => {
  const api = getApi();
  const data = await api.requestJson<number>("/api/v1/notifications/unread-count", {
    method: "GET",
    credentials: "include",
  });

  return unreadCountSchema.parse(data);
};
