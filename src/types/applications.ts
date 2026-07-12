import type { jobSources, jobStatuses } from "@/lib/schemas/application";

type JobStatus = (typeof jobStatuses)[number];
type JobSource = (typeof jobSources)[number] | null;

export type Application = {
  appliedDate: Date | null;
  companyName: string;
  createdAt: Date;
  id: string;
  jobUrl: string | null;
  notes: string | null;
  roleTitle: string;
  salary: string | null;
  source: JobSource;
  status: JobStatus;
  updatedAt: Date;
  userId: string;
};

export type ApplicationFilters = {
  status?: string;
  page?: number;
  limit?: number;
};

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApplicationsResponse {
  success: boolean;
  data: Application[];
  meta: PaginationMeta;
}
