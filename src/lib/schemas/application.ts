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

export const baseSchema = z.object({
  companyName: z
    .string()
    .min(1, "Company name is required")
    .max(255, "Company name is too long"),
  roleTitle: z
    .string()
    .min(1, "Role title is required")
    .max(255, "Role title is too long"),
  status: z.enum(jobStatuses),
  salary: z
    .string()
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "Salary must be a valid number with up to 2 decimal places",
    )
    .nullish(),
  jobUrl: z.url("Job URL must be a valid URL").nullish().or(z.literal("")),
  source: z.enum(jobSources).nullish(),
  notes: z.string().max(5000, "Notes cannot exceed 5000 characters").nullish(),
  appliedDate: z.coerce.date().nullish(),
});

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

export const createApplicationSchema = baseSchema.extend({
  status: z.enum(jobStatuses).default("Saved"),
});

export const updateApplicationSchema = baseSchema.partial();

export const applicationIdParamSchema = z.object({
  id: z.uuid(),
});

export type ListApplicationsQuery = z.infer<typeof listApplicationsQuerySchema>;
export type CreateApplication = z.infer<typeof createApplicationSchema>;
export type UpdateApplication = z.infer<typeof updateApplicationSchema>;
export type ApplicationIdParam = z.infer<typeof applicationIdParamSchema>;
