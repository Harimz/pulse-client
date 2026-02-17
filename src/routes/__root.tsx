import * as React from "react";
import {
  HeadContent,
  Scripts,
  Outlet,
  createRootRoute,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AppProviders } from "../shared/providers/app-providers";

export const Route = createRootRoute({
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
  return (
    <AppProviders>
      <Outlet />
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
