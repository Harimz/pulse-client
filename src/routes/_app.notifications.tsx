import { createFileRoute } from "@tanstack/react-router";
import {
  notificationsListOptions,
  unreadNotificationsCountOptions,
} from "@/modules/notifications/api/notifications.options";
import { NotificationsView } from "@/modules/notifications/ui/views/notifications-view";

const LIMIT = 20;

export const Route = createFileRoute("/_app/notifications")({
  loader: async ({ context }) => {
    await context.queryClient.prefetchInfiniteQuery(notificationsListOptions(LIMIT));
    await context.queryClient.prefetchQuery(unreadNotificationsCountOptions());
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <NotificationsView />;
}
