import { z } from "zod";

export const jobStatuses = [
  "Saved",
  "Applied",
  "Interviewing",
  "Offered",
  "Accepted",
  "Rejected",
  "Withdrawn",
] as const;

export const jobSources = [
  "LinkedIn",
  "Glassdoor",
  "Referral",
  "Company Website",
  "Other",
] as const;

export const listApplicationsQuerySchema = z.object({
  status: z.enum(jobStatuses).optional(),
  source: z.enum(jobSources).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  sortBy: z
    .enum(["createdAt", "updatedAt", "companyName", "roleTitle", "appliedDate"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().max(100).optional(),
});

export type ListApplicationsQuery = z.infer<typeof listApplicationsQuerySchema>;
