import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/following")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/following"!</div>;
}
