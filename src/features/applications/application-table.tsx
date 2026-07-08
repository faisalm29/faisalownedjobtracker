import type { RowSelectionState, SortingState } from "@tanstack/react-table";
import type { z } from "better-auth";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { DataTable } from "#/components/DataTable.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Input } from "#/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select.tsx";
import {
  jobSources,
  jobStatuses,
  type listApplicationsQuerySchema,
} from "#/lib/schemas/application.ts";
import type { Application } from "#/types/applications.ts";
import { columns } from "./columns";

type ApplicationSearch = z.infer<typeof listApplicationsQuerySchema>;

interface ApplicationsTableProps {
  data: Application[];
  total: number;
  page: number;
  limit: number;
  sorting: SortingState;
  search: ApplicationSearch;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onSortingChange: (sorting: SortingState) => void;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSourceChange: (value: string) => void;
}

export function ApplicationsTable({
  data,
  total,
  page,
  limit,
  sorting,
  search,
  onPageChange,
  onLimitChange,
  onSortingChange,
  onSearchChange,
  onStatusChange,
  onSourceChange,
}: ApplicationsTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [searchInput, setSearchInput] = useState(search.search ?? "");
  const totalPages = Math.ceil(total / limit);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    onSearchChange(value);
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="Search company or role..."
            value={searchInput}
            onChange={handleSearchChange}
            className="w-64"
          />

          <Select value={search.status ?? ""} onValueChange={onStatusChange}>
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

          <Select value={search.source ?? ""} onValueChange={onSourceChange}>
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

        <div>
          {/* Bulk action bar */}
          {Object.keys(rowSelection).length > 0 && (
            <div className="flex items-center gap-3">
              <span>{Object.keys(rowSelection).length} row(s) selected</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => console.log("bulk delete")}
              >
                Delete selected
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRowSelection({})}
              >
                Clear selection
              </Button>
            </div>
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        sorting={sorting}
        onSortingChange={onSortingChange}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Rows per page</span>
          <Select
            value={String(limit)}
            onValueChange={(val) => {
              onLimitChange(Number(val));
              onPageChange(1);
            }}
          >
            <SelectTrigger className="w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            Page {page} of {totalPages} · {total} total
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={page <= 1}
            >
              «
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={page >= totalPages}
            >
              »
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
