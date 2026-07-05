// src/routes/_authenticated.tsx

import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authClient } from "#/lib/auth-client.ts";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async ({ context }) => {
		const data = await context.queryClient.ensureQueryData({
			queryKey: ["session"],
			queryFn: async () => {
				const { data, error } = await authClient.getSession();
				if (error) throw error;
				return data;
			},
		});

		if (!data?.user) {
			throw redirect({ to: "/login" });
		}
	},
	component: () => <Outlet />,
});
