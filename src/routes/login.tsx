import { refresh } from "@/modules/auth/api/auth.client";
import { useAuthStore } from "@/modules/auth/state/auth.store";
import { RequireGuest } from "@/modules/auth/ui/components/require-guest";
import { LoginView } from "@/shared/ui/components/login-view";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  loader: async () => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) throw redirect({ to: "/home" });

    try {
      const res = await refresh();
      useAuthStore.getState().setAccessToken(res.accessToken);
      throw redirect({ to: "/home" });
    } catch {}
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RequireGuest>
      <LoginView />
    </RequireGuest>
  );
}
