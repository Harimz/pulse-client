import { useInfiniteQuery } from "@tanstack/react-query";
import { feedKeys } from "./feeds.keys";
import { fetchExplorePage } from "./feeds.client";

export const useExploreFeedInfinite = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: feedKeys.explore(limit),
    queryFn: ({ pageParam }) =>
      fetchExplorePage({ cursor: pageParam ?? null, limit }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 10_0000,
    refetchOnWindowFocus: false,
  });
};
