import { createFileRoute } from "@tanstack/react-router";
import { PostDetailView } from "@/modules/posts/ui/views/post-detail-view";

export const Route = createFileRoute("/_app/post/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  return <PostDetailView postId={id} />;
}
