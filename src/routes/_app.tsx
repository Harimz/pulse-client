import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppLayout } from "@/shared/ui/layouts/app-layout";
import { RequireAuth } from "@/modules/auth/ui/components/require-auth";

export const Route = createFileRoute("/_app")({
  component: AppShell,
});

function AppShell() {
  return (
    <RequireAuth>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </RequireAuth>
  );
}
