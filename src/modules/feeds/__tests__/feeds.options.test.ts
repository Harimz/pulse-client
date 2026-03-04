import { describe, expect, it } from "vitest";
import { followingFeedOptions } from "../api/feeds.options";
import { feedKeys } from "../api/feeds.keys";

describe("followingFeedOptions", () => {
  it("uses following query key", () => {
    const opts = followingFeedOptions(10);
    expect(opts.queryKey).toEqual(feedKeys.following(10));
  });

  it("derives next page param from nextCursor", () => {
    const opts = followingFeedOptions(10);

    const next = opts.getNextPageParam?.({
      items: [],
      nextCursor: "abc123",
    });
    const none = opts.getNextPageParam?.({
      items: [],
      nextCursor: null,
    });

    expect(next).toBe("abc123");
    expect(none).toBeUndefined();
  });
});
