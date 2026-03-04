import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FollowingFeedSection } from "../ui/sections/following-feed-section";

const mockUseFollowingFeedInfinite = vi.fn();

vi.mock("../api/feeds.queries", () => ({
  useFollowingFeedInfinite: () => mockUseFollowingFeedInfinite(),
}));

vi.mock("@/modules/posts/ui/components/post", () => ({
  Post: ({ post }: { post: { id: string; body?: string } }) => (
    <div data-testid={`post-${post.id}`}>{post.body ?? post.id}</div>
  ),
}));

vi.mock("../ui/components/infinite-sentinel", () => ({
  InfiniteSentinel: ({ onVisible }: { onVisible: () => void }) => (
    <button onClick={onVisible}>sentinel</button>
  ),
}));

describe("FollowingFeedSection", () => {
  it("renders posts from following feed", () => {
    mockUseFollowingFeedInfinite.mockReturnValue({
      isError: false,
      isPending: false,
      hasNextPage: true,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
      data: {
        pages: [
          {
            items: [
              { id: "1", body: "first post" },
              { id: "2", body: "second post" },
            ],
          },
        ],
      },
    });

    render(<FollowingFeedSection />);

    expect(screen.getByTestId("post-1")).toHaveTextContent("first post");
    expect(screen.getByTestId("post-2")).toHaveTextContent("second post");
  });

  it("shows empty-state text when no posts", () => {
    mockUseFollowingFeedInfinite.mockReturnValue({
      isError: false,
      isPending: false,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
      data: { pages: [{ items: [] }] },
    });

    render(<FollowingFeedSection />);

    expect(
      screen.getByText("No posts from people you follow yet."),
    ).toBeInTheDocument();
  });

  it("shows caught-up text when end is reached with posts", () => {
    mockUseFollowingFeedInfinite.mockReturnValue({
      isError: false,
      isPending: false,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
      data: { pages: [{ items: [{ id: "1", body: "first post" }] }] },
    });

    render(<FollowingFeedSection />);

    expect(screen.getByText("You’re all caught up.")).toBeInTheDocument();
  });

  it("requests next page when sentinel is triggered", async () => {
    const fetchNextPage = vi.fn();

    mockUseFollowingFeedInfinite.mockReturnValue({
      isError: false,
      isPending: false,
      hasNextPage: true,
      isFetchingNextPage: false,
      fetchNextPage,
      data: { pages: [{ items: [{ id: "1", body: "first post" }] }] },
    });

    render(<FollowingFeedSection />);
    screen.getByText("sentinel").click();

    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });
});
