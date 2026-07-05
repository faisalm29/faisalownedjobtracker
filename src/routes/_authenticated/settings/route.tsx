// src/routes/_authenticated/settings/route.tsx

import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings")({
	component: SettingsLayout,
});

function SettingsLayout() {
	return (
		<div>
			<h1>Settings</h1>
			<Outlet />
		</div>
	);
}
