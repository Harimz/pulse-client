import { infiniteQueryOptions } from "@tanstack/react-query";
import type { CursorPageResponse } from "../domain/feed.schemas";
import { feedKeys } from "./feeds.keys";
import { fetchExplorePage, fetchFollowingPage } from "./feeds.client";

export const exploreFeedOptions = (limit: number) =>
  infiniteQueryOptions<CursorPageResponse>({
    queryKey: feedKeys.explore(limit),
    queryFn: ({ pageParam }) =>
      fetchExplorePage({
        cursor: (pageParam as string | null) ?? null,
        limit,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

export const followingFeedOptions = (limit: number) =>
  infiniteQueryOptions<CursorPageResponse>({
    queryKey: feedKeys.following(limit),
    queryFn: ({ pageParam }) =>
      fetchFollowingPage({
        cursor: (pageParam as string | null) ?? null,
        limit,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
