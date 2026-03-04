import { Spinner } from "@/components/ui/spinner";
import { Post } from "@/modules/posts/ui/components/post";
import { useFollowingFeedInfinite } from "../../api/feeds.queries";
import { InfiniteSentinel } from "../components/infinite-sentinel";

export const FollowingFeedSection = () => {
  const q = useFollowingFeedInfinite(10);

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

      {!q.isPending && items.length === 0 && (
        <div className="pb-20 pt-6 text-center text-sm text-muted-foreground">
          No posts from people you follow yet.
        </div>
      )}

      {!q.hasNextPage && items.length > 0 && (
        <div className="pb-20 text-center text-sm text-muted-foreground">
          You’re all caught up.
        </div>
      )}
    </div>
  );
};
