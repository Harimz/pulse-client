import { exploreFeedOptions } from "@/modules/feeds/api/feeds.options";
import { ExploreView } from "@/modules/feeds/ui/views/explore-view";
import { createFileRoute } from "@tanstack/react-router";

const LIMIT = 10;

export const Route = createFileRoute("/_app/home")({
  loader: async ({ context }) => {
    await context.queryClient.prefetchInfiniteQuery(exploreFeedOptions(LIMIT));
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <ExploreView />;
}
