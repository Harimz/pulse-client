import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/post/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/post/$id"!</div>;
}
