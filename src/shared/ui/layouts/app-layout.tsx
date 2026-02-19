import * as React from "react";
import { AppSidebar } from "../components/app-sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted/50 min-h-screen">
      <div className="hidden lg:block">
        <AppSidebar />
      </div>

      <main className="mx-auto max-w-500 w-[95%] lg:pl-80 lg:pr-0">
        <div className="lg:pl-10">{children}</div>
      </main>
    </div>
  );
}
