// src/routes/_authenticated.tsx

import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar } from "#/components/AppSidebar.tsx";
import { SiteHeader } from "#/components/SiteHeader.tsx";
import { SidebarProvider } from "#/components/ui/sidebar.tsx";
import { TooltipProvider } from "#/components/ui/tooltip.tsx";
import { authClient } from "#/lib/auth-client.ts";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const data = await context.queryClient.ensureQueryData({
      queryKey: ["session"],
      queryFn: async () => {
        const { data, error } = await authClient.getSession();
        if (error) throw error;
        return data;
      },
    });

    if (!data?.user) {
      throw redirect({ to: "/login" });
    }
  },
  component: () => <AuthenticatedLayout />,
});

function AuthenticatedLayout() {
  return (
    <SidebarProvider>
      <TooltipProvider>
        <AppSidebar />
        <div className="w-full">
          <SiteHeader />
          <main>
            <Outlet />
          </main>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
}
