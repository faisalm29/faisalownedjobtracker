import type { ApplicationFilters } from "@/types/applications";

export const applicationKeys = {
  all: ["applications"] as const,
  lists: () => [...applicationKeys.all, "list"] as const,
  list: (filters: ApplicationFilters) =>
    [...applicationKeys.lists(), filters] as const,
  detail: (id: string) => [...applicationKeys.all, "detail", id] as const,
};
