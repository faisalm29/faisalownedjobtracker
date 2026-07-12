import { queryOptions } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useApplication } from "#/hooks/use-application.ts";
import { apiFetch } from "#/lib/api.ts";
import {
  baseSchema,
  jobSources,
  jobStatuses,
  updateApplicationSchema,
} from "#/lib/schemas/application.ts";
import type { Application } from "#/types/applications.ts";
import { EditApplicationForm } from "@/components/EditApplicationForm";

// const applicationResponseSchema = z.object({
//   id: z.string(),
//   companyName: z.string(),
//   roleTitle: z.string(),
//   status: z.enum(jobStatuses).nullable(),
//   salary: z.string().nullable(),
//   jobUrl: z.string().nullable(),
//   source: z.enum(jobSources).nullable(),
//   notes: z.string().nullable(),
//   appliedDate: z.coerce.date().nullable(), // coerces the string → Date
//   createdAt: z.coerce.date(),
//   updatedAt: z.coerce.date(),
//   userId: z.string(),
// });

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export const applicationQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["applications", id],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/v1/applications/${id}`);
      if (!res.ok) throw new Error("Failed to fetch application");
      const json = await res.json();
      // console.log(json.data);
      return updateApplicationSchema.parse(json.data);
    },
  });

export const Route = createFileRoute("/_authenticated/applications/$id/edit")({
  loader: ({ params, context: { queryClient } }) =>
    queryClient.ensureQueryData(applicationQueryOptions(params.id)),
  component: RouteComponent,
});

function RouteComponent() {
  const application: Application = Route.useLoaderData();

  return (
    <div>
      <EditApplicationForm application={application} />
    </div>
  );
}
