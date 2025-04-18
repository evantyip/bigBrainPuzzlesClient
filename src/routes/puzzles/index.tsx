import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/puzzles/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/puzzles"!</div>
}

