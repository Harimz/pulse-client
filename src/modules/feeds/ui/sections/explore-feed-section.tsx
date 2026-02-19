import React from "react";
import { useExploreFeedInfinite } from "../../api/feeds.queries";
import { Post } from "@/modules/posts/ui/components/post";
import { InfiniteSentinel } from "../components/infinite-sentinel";
import { Spinner } from "@/components/ui/spinner";

export const ExploreFeedSection = () => {
  const q = useExploreFeedInfinite(10);

  if (q.isError) return <div>Failed to load feed</div>;

  const items = q.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className="mt-6">
      {items.map((item) => (
        <Post post={item} key={item.id} />
      ))}

      <InfiniteSentinel
        disabled={!q.hasNextPage || q.isFetchingNextPage}
        onVisible={() => {
          if (q.hasNextPage && !q.isFetchingNextPage) q.fetchNextPage();
        }}
      />

      {q.isFetchingNextPage && (
        <div className="flex items-center justify-center">
          <Spinner className="size-6" />
        </div>
      )}

      {!q.hasNextPage && items.length > 0 && (
        <div className="text-sm text-muted-foreground text-center pb-20">
          You’re all caught up.
        </div>
      )}
    </div>
  );
};
