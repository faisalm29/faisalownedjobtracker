import type { RowSelectionState, SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { DataTable } from "#/components/DataTable.tsx";
import { Button } from "#/components/ui/button.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select.tsx";
import type { Application } from "#/types/applications.ts";
import { columns } from "./columns";

interface ApplicationsTableProps {
  data: Application[];
  total: number;
  page: number;
  limit: number;
  sorting: SortingState;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onSortingChange: (sorting: SortingState) => void;
}

export function ApplicationsTable({
  data,
  total,
  page,
  limit,
  sorting,
  onPageChange,
  onLimitChange,
  onSortingChange,
}: ApplicationsTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      {/* Bulk action bar */}
      {Object.keys(rowSelection).length > 0 && (
        <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-4 py-2 text-sm">
          <span>{Object.keys(rowSelection).length} row(s) selected</span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => console.log("bulk delete")}
          >
            Delete selected
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setRowSelection({})}>
            Clear selection
          </Button>
        </div>
      )}

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
