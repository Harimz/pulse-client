import * as React from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppLayout } from "@/shared/ui/layouts/app-layout";

export const Route = createFileRoute("/_app")({
  component: AppShell,
});

function AppShell() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
