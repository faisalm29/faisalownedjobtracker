import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/applications/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="my-16">
      <Outlet />
    </div>
  );
}
