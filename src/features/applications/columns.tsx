import { createColumnHelper } from "@tanstack/react-table";
import { SquareArrowOutUpRight } from "lucide-react";
import type { Application } from "@/types/applications";

const col = createColumnHelper<Application>();

export const columns = [
  col.accessor("companyName", {
    header: "Company",
  }),
  col.accessor("roleTitle", {
    header: "Role",
  }),
  col.accessor("status", {
    header: "Status",
    cell: (props) => <span>{props.getValue()}</span>,
  }),
  col.accessor("salary", {
    header: "Salary",
  }),
  col.accessor("jobUrl", {
    header: "Link",
    cell: (props) => {
      const url = props.getValue();
      return url ? (
        <a href={url}>
          <SquareArrowOutUpRight />
        </a>
      ) : (
        "-"
      );
    },
  }),
  col.accessor("source", {
    header: "Source",
  }),
  col.accessor("appliedDate", {
    header: "Applied Date",
    cell: (props) => {
      const date = props.getValue();
      return date ? new Date(date).toLocaleDateString() : "-";
    },
  }),
  col.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <button
        type="button"
        onClick={() => console.log("edit", row.original.id)}
      >
        Edit
      </button>
    ),
  }),
];
