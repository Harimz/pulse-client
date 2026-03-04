import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@tanstack/react-router";
import type { NotificationResponse } from "../../domain/notifications.schemas";

const FALLBACK_AVATAR =
  "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

const parsePayload = (payloadJson: string): Record<string, unknown> => {
  try {
    const parsed = JSON.parse(payloadJson);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const getDisplayText = (notification: NotificationResponse) => {
  const username = notification.fromUser?.username
    ? `@${notification.fromUser.username}`
    : "Someone";

  if (notification.type === "USER_FOLLOWED") {
    return `${username} followed you`;
  }

  if (notification.type === "USER_MENTIONED") {
    return `${username} mentioned you in a post`;
  }

  return "You have a new notification";
};

const getTarget = (notification: NotificationResponse) => {
  const payload = parsePayload(notification.payloadJson);

  if (
    notification.type === "USER_MENTIONED" &&
    typeof payload.postId === "string"
  ) {
    return {
      to: "/post/$id" as const,
      params: { id: String(payload.postId) },
    };
  }

  if (notification.type === "USER_FOLLOWED" && notification.fromUser?.username) {
    return {
      to: "/profile/$username" as const,
      params: { username: notification.fromUser.username },
    };
  }

  return null;
};

export const NotificationItem = ({
  notification,
}: {
  notification: NotificationResponse;
}) => {
  const target = getTarget(notification);
  const isUnread = notification.readAt == null;

  const content = (
    <div
      className={`flex gap-4 border-b px-6 py-4 ${isUnread ? "bg-muted/40" : ""}`}
    >
      <Avatar>
        <AvatarImage src={notification.fromUser?.avatarUrl ?? FALLBACK_AVATAR} />
      </Avatar>

      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm">{getDisplayText(notification)}</p>
          {isUnread && (
            <span
              data-testid="unread-indicator"
              className="mt-1 inline-block size-2 rounded-full bg-custom-primary"
            />
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {new Date(notification.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );

  if (!target) return content;

  return (
    <Link to={target.to} params={target.params}>
      {content}
    </Link>
  );
};
