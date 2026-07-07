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
import { ApplicationsTable } from "#/features/applications/application-table.tsx";
import { useApplications } from "#/hooks/use-application.ts";
import {
  jobSources,
  jobStatuses,
  listApplicationsQuerySchema,
} from "#/lib/schemas/application.ts";

export const Route = createFileRoute("/_authenticated/applications/")({
  validateSearch: listApplicationsQuerySchema,
  component: ApplicationPage,
});

function ApplicationPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data, isLoading, isError, error } = useApplications(search);
  const [searchInput, setSearchInput] = useState(search.search ?? "");

  // Derive sorting state from URL for DataTable
  const sorting: SortingState = search.sortBy
    ? [
        {
          id: search.sortBy,
          desc: search.sortOrder === "desc",
        },
      ]
    : [];

  const debouncedNavigate = useDebouncedCallback((value: string) => {
    navigate({
      search: (prev) => ({ ...prev, search: value || undefined, page: 1 }),
    });
  }, 500);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchInput(e.target.value);
    debouncedNavigate(e.target.value);
  }

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
    <div className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Applications</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search company or role..."
          value={searchInput}
          onChange={handleSearchChange}
          className="w-64"
        />

        <Select
          value={search.status ?? ""}
          onValueChange={(val) =>
            navigate({
              search: (prev) => ({
                ...prev,
                status: (val as (typeof jobStatuses)[number]) || undefined,
                page: 1,
              }),
            })
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All statuses</SelectItem>
            {jobStatuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={search.source ?? ""}
          onValueChange={(val) =>
            navigate({
              search: (prev) => ({
                ...prev,
                source: (val as (typeof jobSources)[number]) || undefined,
                page: 1,
              }),
            })
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All sources</SelectItem>
            {jobSources.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ApplicationsTable
        data={data?.data ?? []}
        total={data?.meta.total ?? 0}
        page={data?.meta.page ?? 1}
        limit={search.limit}
        sorting={sorting}
        onPageChange={(page) =>
          navigate({ search: (prev) => ({ ...prev, page }) })
        }
        onLimitChange={(limit) =>
          navigate({ search: (prev) => ({ ...prev, limit, page: 1 }) })
        }
        onSortingChange={handleSortingChange}
      />
    </div>
  );
}
