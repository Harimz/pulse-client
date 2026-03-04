import { describe, expect, it } from "vitest";
import { notificationsListOptions } from "../api/notifications.options";
import { notificationsKeys } from "../api/notifications.keys";

describe("notificationsListOptions", () => {
  it("uses notifications list query key", () => {
    const opts = notificationsListOptions(20);
    expect(opts.queryKey).toEqual(notificationsKeys.list(20));
  });

  it("maps nextCursor to next page param", () => {
    const opts = notificationsListOptions(20);

    const next = opts.getNextPageParam?.({ items: [], nextCursor: "nxt" });
    const none = opts.getNextPageParam?.({ items: [], nextCursor: null });

    expect(next).toBe("nxt");
    expect(none).toBeUndefined();
  });
});
