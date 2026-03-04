import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AppSidebar } from "../app-sidebar";

const authState = {
  status: "ready",
  accessToken: "token",
};

vi.mock("@/modules/auth/state/auth.store", () => ({
  useAuthStore: (selector: (state: typeof authState) => unknown) =>
    selector(authState),
}));

vi.mock("@/modules/auth/api/auth.queries", () => ({
  useMe: () => ({
    data: {
      username: "john",
    },
  }),
}));

vi.mock("@/modules/notifications/api/notifications.queries", () => ({
  useUnreadNotificationsCount: () => ({
    data: 3,
  }),
}));

vi.mock("@/modules/auth/ui/components/auth-button", () => ({
  AuthButton: () => <div>auth-button</div>,
}));

vi.mock("@tanstack/react-router", () => ({
  useLocation: () => ({ pathname: "/notifications" }),
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

describe("AppSidebar", () => {
  it("shows unread notifications badge when count is greater than zero", () => {
    render(<AppSidebar />);

    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
