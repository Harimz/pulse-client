import { useUnreadNotificationsCount } from "../../api/notifications.queries";
import { NotificationsListSection } from "../sections/notifications-list-section";

export const NotificationsView = () => {
  const unreadCount = useUnreadNotificationsCount();

  return (
    <div>
      <div className="border-b px-6 py-6">
        <h1 className="font-bold">Notifications</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Unread: {unreadCount.data ?? 0}
        </p>
      </div>

      <NotificationsListSection />
    </div>
  );
};
