import { infiniteQueryOptions } from "@tanstack/react-query";
import type { ExploreFeedPage } from "../domain/feed.schemas";
import { feedKeys } from "./feeds.keys";
import { fetchExplorePage } from "./feeds.client";

export const exploreFeedOptions = (limit: number) =>
  infiniteQueryOptions<ExploreFeedPage>({
    queryKey: feedKeys.explore(limit),
    queryFn: ({ pageParam }) =>
      fetchExplorePage({
        cursor: (pageParam as string | null) ?? null,
        limit,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
