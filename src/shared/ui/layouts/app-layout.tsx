import * as React from "react";
import { AppSidebar } from "../components/app-sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted/50 relative min-h-screen">
      <AppSidebar />
      <main className="border mx-auto max-w-400 w-400">{children}</main>
    </div>
  );
}
