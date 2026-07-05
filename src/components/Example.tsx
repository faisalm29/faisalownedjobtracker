import { useApplications } from "@/hooks/use-application";

export function Example() {
	const { data, isLoading, isError, error } = useApplications({
		status: "Applied",
	});

	if (isLoading) return <div>Loading...</div>;
	if (isError) return <div>Error: {error.message}</div>;

	return (
		<ul>
			{data?.data.map((app) => (
				<li key={app.id}>
					{app.companyName} - {app.roleTitle}
				</li>
			))}
		</ul>
	);
}
