import { Spinner } from "@/components/ui/spinner";
import { useNotificationsInfinite } from "../../api/notifications.queries";
import { InfiniteSentinel } from "@/modules/feeds/ui/components/infinite-sentinel";
import { NotificationItem } from "../components/notification-item";

export const NotificationsListSection = () => {
  const q = useNotificationsInfinite(20);

  if (q.isError) return <div>Failed to load notifications</div>;

  const items = q.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className="mt-4">
      {items.map((item) => (
        <NotificationItem key={item.id} notification={item} />
      ))}

      <InfiniteSentinel
        disabled={!q.hasNextPage || q.isFetchingNextPage}
        onVisible={() => {
          if (q.hasNextPage && !q.isFetchingNextPage) q.fetchNextPage();
        }}
      />

      {q.isFetchingNextPage && (
        <div className="flex items-center justify-center py-3">
          <Spinner className="size-6" />
        </div>
      )}

      {!q.isPending && items.length === 0 && (
        <div className="pb-20 pt-6 text-center text-sm text-muted-foreground">
          No notifications yet.
        </div>
      )}

      {!q.hasNextPage && items.length > 0 && (
        <div className="pb-20 text-center text-sm text-muted-foreground">
          You’re all caught up.
        </div>
      )}
    </div>
  );
};
