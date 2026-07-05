import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { applicationKeys } from "@/lib/query-keys";
import type { ListApplicationsQuery } from "@/lib/schemas/application";
import type { Application } from "@/types/applications";

export function useApplications(query: Partial<ListApplicationsQuery> = {}) {
	return useQuery({
		queryKey: applicationKeys.list(query),
		queryFn: () => {
			const params = new URLSearchParams(
				Object.entries(query)
					.filter(([, v]) => v !== null)
					.map(([k, v]) => [k, String(v)]),
			);
			return apiFetch<{ data: Application[]; total: number }>(
				`/applications?${params}`,
			);
		},
	});
}

export function useApplication(id: string) {
	return useQuery({
		queryKey: applicationKeys.detail(id),
		queryFn: () => apiFetch<Application>(`/applications/${id}`),
		enabled: !!id,
	});
}

export function useCreateAppliction() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: Omit<Application, "id" | "createdAt" | "appliedDate">) =>
			apiFetch<Application>(`/applications`, {
				method: "POST",
				body: JSON.stringify(body),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
		},
	});
}

export function useUpdateApplication(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: Partial<Application>) =>
			apiFetch(`/applications/${id}`, {
				method: "PATCH",
				body: JSON.stringify(body),
			}),
		onSuccess: (updated) => {
			queryClient.setQueryData(applicationKeys.detail(id), updated);
			queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
		},
	});
}

export function useDeleteApplication() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) =>
			apiFetch<void>(`/applications/${id}`, { method: "DELETE" }),
		onSuccess: (_, id) => {
			queryClient.removeQueries({ queryKey: applicationKeys.detail(id) }),
				queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
		},
	});
}
