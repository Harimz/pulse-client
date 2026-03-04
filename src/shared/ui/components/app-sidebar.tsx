import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMe } from "@/modules/auth/api/auth.queries";
import { useAuthStore } from "@/modules/auth/state/auth.store";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";
import { useUnreadNotificationsCount } from "@/modules/notifications/api/notifications.queries";
import { Link, useLocation } from "@tanstack/react-router";
import { Bell, Compass, Plus, User, Users } from "lucide-react";

export const AppSidebar = () => {
  const { pathname } = useLocation();
  const { data } = useMe();
  const authStatus = useAuthStore((s) => s.status);
  const accessToken = useAuthStore((s) => s.accessToken);
  const unreadCount = useUnreadNotificationsCount();

  const user = accessToken ? data : undefined;
  const unreadBadgeText =
    typeof unreadCount.data === "number" && unreadCount.data > 99
      ? "99+"
      : unreadCount.data;

  const isBootstrapping = authStatus !== "ready";
  if (isBootstrapping) return "loading...";

  const SIDEBAR_ITEMS = [
    {
      id: 0,
      icon: <Compass className="size-4" />,
      label: "Explore",
      href: "/home",
      protected: true,
    },
    {
      id: 1,
      icon: <Users className="size-4" />,
      label: "Following",
      href: "/following",
      protected: true,
    },
    {
      id: 2,
      icon: <Bell className="size-4" />,
      label: "Notifications",
      href: "/notifications",
      protected: true,
    },
    {
      id: 3,
      icon: <User className="size-4" />,
      label: "Profile",
      href: `/profile/${user?.username}`,
      protected: true,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[20rem] bg-white border-r border-border p-6">
      <div className="h-full flex flex-col">
        <div className="flex flex-col gap-2">
          {SIDEBAR_ITEMS.map((item) => (
            <Link to={item.href} key={item.id} hidden={item.protected && !user}>
                <div
                  className={cn(
                  "flex gap-6 p-4 rounded-md font-semibold text-sm text-muted-foreground items-center",
                  pathname === item.href &&
                    "bg-custom-primary/10 text-custom-primary",
                )}
              >
                {item.icon}
                <div className="flex w-full items-center justify-between gap-2">
                  <p>{item.label}</p>
                  {item.href === "/notifications" &&
                    typeof unreadCount.data === "number" &&
                    unreadCount.data > 0 && (
                      <Badge className="h-5 min-w-5 px-1.5 text-[10px]">
                        {unreadBadgeText}
                      </Badge>
                    )}
                </div>
              </div>
            </Link>
          ))}

          {user && (
            <Link to="/home" className="w-full">
              <Button className="mt-4 w-full" variant="primary">
                <Plus /> Create Post
              </Button>
            </Link>
          )}
        </div>

        <div className={cn(user && "mt-auto")}>
          <AuthButton user={user} />
        </div>
      </div>
    </aside>
  );
};
