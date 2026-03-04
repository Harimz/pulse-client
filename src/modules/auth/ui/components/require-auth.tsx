import React from "react";
import { useAuthStore } from "../../state/auth.store";
import { Navigate } from "@tanstack/react-router";

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { status, accessToken } = useAuthStore();

  if (status !== "ready") {
    return <div className="p-6">Loading...</div>;
  }

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
