import * as React from "react";
import {
  HeadContent,
  Scripts,
  Outlet,
  createRootRoute,
  createRootRouteWithContext,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AppProviders } from "../shared/providers/app-providers";
import type { RouterContext } from "@/shared/types/router-context";
import { AuthDialog } from "@/modules/auth/ui/components/auth-dialog";
import { AuthBootstrap } from "@/modules/auth/ui/components/auth-bootstrap";
import { Toaster } from "sonner";

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Pulse" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),

  component: RootComponent,

  shellComponent: RootDocument,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <AppProviders queryClient={queryClient}>
      <Toaster />
      <AuthBootstrap />

      <Outlet />

      <AuthDialog />
    </AppProviders>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
