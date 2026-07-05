import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useSession } from "@/hooks/use-session.ts";
import { useUpdateUser } from "@/hooks/use-user.ts";

export const Route = createFileRoute("/_authenticated/settings/")({
	component: SettingPage,
});

function SettingPage() {
	const { data: session } = useSession();
	const updateUser = useUpdateUser();

	const [name, setName] = useState(session?.user.name ?? "");

	function handleSubmit(e: React.SubmitEvent) {
		e.preventDefault();
		updateUser.mutate({ name });
	}

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="name">Display name</label>
			<input
				id="name"
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
				disabled={updateUser.isPending}
			/>

			{updateUser.isError && <p role="alert">{updateUser.error.message}</p>}
			{updateUser.isSuccess && <p>Name updated successfully.</p>}

			<button type="submit" disabled={updateUser.isPending}>
				{updateUser.isPending ? "Saving..." : "Save changes"}
			</button>
		</form>
	);
}
