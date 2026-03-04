import { createFileRoute } from "@tanstack/react-router";
import { followingFeedOptions } from "@/modules/feeds/api/feeds.options";
import { FollowingView } from "@/modules/feeds/ui/views/following-view";

const LIMIT = 10;

export const Route = createFileRoute("/_app/following")({
  loader: async ({ context }) => {
    await context.queryClient.prefetchInfiniteQuery(followingFeedOptions(LIMIT));
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <FollowingView />;
}
