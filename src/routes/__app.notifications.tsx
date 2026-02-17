import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__app/notifications")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/__app/notifications"!</div>;
}
