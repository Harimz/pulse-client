import { cn } from "@/lib/utils";
import { useMe } from "@/modules/auth/api/auth.queries";
import { useAuthStore } from "@/modules/auth/state/auth.store";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";
import { Link, useLocation } from "@tanstack/react-router";
import { Bell, Compass, User, Users } from "lucide-react";

const SIDEBAR_ITEMS = [
  {
    id: 0,
    icon: <Compass className="size-4" />,
    label: "Explore",
    href: "/home",
  },
  {
    id: 1,
    icon: <Users className="size-4" />,
    label: "Following",
    href: "/following",
  },
  {
    id: 2,
    icon: <Bell className="size-4" />,
    label: "Notifications",
    href: "/notifications",
  },
  {
    id: 3,
    icon: <User className="size-4" />,
    label: "Profile",
    href: "/profile",
  },
];

export const AppSidebar = () => {
  const { pathname } = useLocation();
  const { data } = useMe();
  const authStatus = useAuthStore((s) => s.status);
  const accessToken = useAuthStore((s) => s.accessToken);

  const user = accessToken ? data : undefined;

  const isBootstrapping = authStatus !== "ready";

  if (isBootstrapping) return "loading...";

  return (
    <aside className="bg-white w-[20rem] fixed top-0 bottom-0 border-r border-border p-6">
      <div className="relative h-full flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          {SIDEBAR_ITEMS.map((item) => (
            <Link to={item.href} key={item.id}>
              <div
                className={cn(
                  "flex gap-6 p-4 rounded-md font-semibold text-sm text-muted-foreground items-center",
                  pathname === item.href &&
                    "bg-custom-primary/10 text-custom-primary",
                )}
              >
                {item.icon}
                <p>{item.label}</p>
              </div>
            </Link>
          ))}
        </div>

        <AuthButton user={user} />
      </div>
    </aside>
  );
};
