export const notificationsKeys = {
  all: ["notifications"] as const,
  list: (limit: number) =>
    [...notificationsKeys.all, "list", { limit }] as const,
  unreadCount: () => [...notificationsKeys.all, "unread-count"] as const,
};
