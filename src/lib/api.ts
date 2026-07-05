const API_BASE = import.meta.env.VITE_API_URL ?? "";

export class AppError extends Error {
	constructor(
		public status: number,
		message: string,
	) {
		super(message);
	}
}

export async function apiFetch<T>(
	path: string,
	init?: RequestInit,
): Promise<T> {
	const res = await fetch(`${API_BASE}/api/v1${path}`, {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		...init,
	});

	if (!res.ok) {
		const body = await res.json().catch(() => ({ message: "Unknown error" }));
		throw new AppError(res.status, body.message ?? "Request failed");
	}

	return res.json() as Promise<T>;
}
