import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NotificationsListSection } from "../ui/sections/notifications-list-section";

const mockUseNotificationsInfinite = vi.fn();

vi.mock("../api/notifications.queries", () => ({
  useNotificationsInfinite: () => mockUseNotificationsInfinite(),
}));

vi.mock("@/modules/feeds/ui/components/infinite-sentinel", () => ({
  InfiniteSentinel: ({ onVisible }: { onVisible: () => void }) => (
    <button onClick={onVisible}>sentinel</button>
  ),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

describe("NotificationsListSection", () => {
  it("renders notifications from pages", () => {
    mockUseNotificationsInfinite.mockReturnValue({
      isError: false,
      isPending: false,
      hasNextPage: true,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
      data: {
        pages: [
          {
            items: [
              {
                id: "11111111-1111-4111-8111-111111111111",
                toUserId: "22222222-2222-4222-8222-222222222222",
                type: "USER_FOLLOWED",
                payloadJson: "{}",
                createdAt: "2026-03-03T00:00:00Z",
                readAt: null,
                fromUser: {
                  id: "33333333-3333-4333-8333-333333333333",
                  username: "alice",
                  avatarUrl: null,
                },
              },
            ],
          },
        ],
      },
    });

    render(<NotificationsListSection />);

    expect(screen.getByText("@alice followed you")).toBeInTheDocument();
    expect(screen.getByTestId("unread-indicator")).toBeInTheDocument();
  });

  it("shows empty state when there are no notifications", () => {
    mockUseNotificationsInfinite.mockReturnValue({
      isError: false,
      isPending: false,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
      data: { pages: [{ items: [] }] },
    });

    render(<NotificationsListSection />);

    expect(screen.getByText("No notifications yet.")).toBeInTheDocument();
  });

  it("shows caught-up text at end with items", () => {
    mockUseNotificationsInfinite.mockReturnValue({
      isError: false,
      isPending: false,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
      data: {
        pages: [
          {
            items: [
              {
                id: "11111111-1111-4111-8111-111111111111",
                toUserId: "22222222-2222-4222-8222-222222222222",
                type: "USER_FOLLOWED",
                payloadJson: "{}",
                createdAt: "2026-03-03T00:00:00Z",
                readAt: "2026-03-03T01:00:00Z",
                fromUser: {
                  id: "33333333-3333-4333-8333-333333333333",
                  username: "alice",
                  avatarUrl: null,
                },
              },
            ],
          },
        ],
      },
    });

    render(<NotificationsListSection />);

    expect(screen.getByText("You’re all caught up.")).toBeInTheDocument();
  });

  it("triggers next page load from sentinel", () => {
    const fetchNextPage = vi.fn();

    mockUseNotificationsInfinite.mockReturnValue({
      isError: false,
      isPending: false,
      hasNextPage: true,
      isFetchingNextPage: false,
      fetchNextPage,
      data: { pages: [{ items: [] }] },
    });

    render(<NotificationsListSection />);
    screen.getByText("sentinel").click();

    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });
});
