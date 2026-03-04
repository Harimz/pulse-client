import React from "react";
import { useAuthStore } from "../../state/auth.store";
import { Navigate } from "@tanstack/react-router";

export const RequireGuest = ({ children }: { children: React.ReactNode }) => {
  const status = useAuthStore((s) => s.status);
  const accessToken = useAuthStore((s) => s.accessToken);

  if (status !== "ready") {
    return <div className="p-6">Loading...</div>;
  }

  if (accessToken) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};
