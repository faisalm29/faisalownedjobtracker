import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
	jobSources,
	jobStatuses,
	listApplicationsQuerySchema,
} from "#/lib/schemas/application.ts";
import { ApplicationsTable } from "@/features/applications/application-table";
import { useApplications } from "@/hooks/use-application";
import { useLogout } from "@/hooks/use-auth";
import { useSession } from "@/hooks/use-session";

export const Route = createFileRoute("/_authenticated/applications/")({
	validateSearch: listApplicationsQuerySchema,
	component: ApplicationPage,
});

function ApplicationPage() {
	// const { data: session } = useSession();
	// const logout = useLogout();
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const { data, isLoading, isError, error } = useApplications(search);

	// Local state for the input - independent from URL
	const [searchInput, setSearchInput] = useState(search.search ?? "");

	// Only update the URL after user stops typing for 500ms
	const debouncedNavigate = useDebouncedCallback((value: string) => {
		navigate({
			search: (prev) => ({
				...prev,
				search: value || undefined,
				page: 1,
			}),
		});
	}, 500);

	function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
		setSearchInput(e.target.value); // updates input instantly
		debouncedNavigate(e.target.value); // updates URL + triggers fetch after delay
	}

	if (isLoading) return <div>Loading...</div>;
	if (isError) return <div>Error: {error.message}</div>;

	return (
		<div>
			<div>
				{/* Status filter */}
				<select
					value={search.status ?? ""}
					onChange={(e) =>
						navigate({
							search: (prev) => ({
								...prev,
								status:
									(e.target.value as (typeof jobStatuses)[number]) || undefined,
								page: 1, // reset page on filter change
							}),
						})
					}
				>
					<option value="">All statuses</option>
					{jobStatuses.map((s) => (
						<option key={s} value={s}>
							{s}
						</option>
					))}
				</select>

				{/* Source filter */}
				<select
					value={search.source ?? ""}
					onChange={(e) =>
						navigate({
							search: (prev) => ({
								...prev,
								source:
									(e.target.value as (typeof jobSources)[number]) || undefined,
								page: 1,
							}),
						})
					}
				>
					<option value="">All sources</option>
					{jobSources.map((s) => (
						<option key={s} value={s}>
							{s}
						</option>
					))}
				</select>

				{/* Search */}
				<input
					type="search"
					placeholder="Search..."
					value={searchInput}
					onChange={handleSearchChange}
				/>
			</div>

			<ApplicationsTable
				data={data?.data ?? []}
				total={data?.total ?? 0}
				page={search.page}
				limit={search.limit}
				onPageChange={(page) =>
					navigate({ search: (prev) => ({ ...prev, page }) })
				}
			/>
		</div>
	);
}
