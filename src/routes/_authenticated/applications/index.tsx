import { createFileRoute } from "@tanstack/react-router";
import type { SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "#/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select.tsx";
import { SidebarProvider } from "#/components/ui/sidebar.tsx";
import { TooltipProvider } from "#/components/ui/tooltip.tsx";
import { ApplicationsTable } from "#/features/applications/application-table.tsx";
import { useApplications } from "#/hooks/use-application.ts";
import {
  jobSources,
  jobStatuses,
  listApplicationsQuerySchema,
} from "#/lib/schemas/application.ts";
import { AppSidebar } from "@/components/AppSidebar";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/_authenticated/applications/")({
  validateSearch: listApplicationsQuerySchema,
  component: ApplicationPage,
});

function ApplicationPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data, isLoading, isError, error } = useApplications(search);

  // Derive sorting state from URL for DataTable
  const sorting: SortingState = search.sortBy
    ? [
        {
          id: search.sortBy,
          desc: search.sortOrder === "desc",
        },
      ]
    : [];

  function handleSortingChange(next: SortingState) {
    const first = next[0];
    navigate({
      search: (prev) => ({
        ...prev,
        sortBy: first ? (first.id as typeof search.sortBy) : "createdAt",
        sortOrder: first ? (first.desc ? "desc" : "asc") : "desc",
        page: 1,
      }),
    });
  }

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="space-y-4 p-6">
        <ApplicationsTable
          data={data?.data ?? []}
          total={data?.meta.total ?? 0}
          page={data?.meta.page ?? 1}
          limit={search.limit}
          sorting={sorting}
          search={search}
          onPageChange={(page) =>
            navigate({ search: (prev) => ({ ...prev, page }) })
          }
          onLimitChange={(limit) =>
            navigate({ search: (prev) => ({ ...prev, limit, page: 1 }) })
          }
          onSortingChange={handleSortingChange}
          onSearchChange={(value) =>
            navigate({
              search: (prev) => ({
                ...prev,
                search: value || undefined,
                page: 1,
              }),
            })
          }
          onStatusChange={(val) =>
            navigate({
              search: (prev) => ({
                ...prev,
                status: (val as (typeof jobStatuses)[number]) || undefined,
                page: 1,
              }),
            })
          }
          onSourceChange={(val) =>
            navigate({
              search: (prev) => ({
                ...prev,
                source: (val as (typeof jobSources)[number]) || undefined,
                page: 1,
              }),
            })
          }
        />
      </div>
    </div>
  );
}
