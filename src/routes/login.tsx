import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "#/lib/auth-client.ts";
import { useLogin } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
	beforeLoad: async ({ context }) => {
		const session = await context.queryClient.ensureQueryData({
			queryKey: ["session"],
			queryFn: async () => {
				const { data } = await authClient.getSession();
				return data;
			},
		});

		if (session?.user) {
			throw redirect({ to: "/applications" });
		}
	},
	component: LoginPage,
});

function LoginPage() {
	const navigate = useNavigate();
	const login = useLogin();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	async function handleSubmit(e: React.SubmitEvent) {
		e.preventDefault();
		login.mutate({ email, password });
	}

	return (
		<div>
			<h1>Sign in</h1>

			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="email">Email</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						disabled={login.isPending}
						required
					/>
				</div>

				<div>
					<label htmlFor="password">Password</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						disabled={login.isPending}
						required
					/>
				</div>

				{login.isError && <p role="alert">{login.error.message}</p>}

				<button type="submit" disabled={login.isPending}>
					{login.isPending ? "Signing in..." : "Sign in"}
				</button>
			</form>
		</div>
	);
}
