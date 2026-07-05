import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

type Session = typeof authClient.$Infer.Session;

export const sessionKeys = {
	all: ["sessions"] as const,
};

export function useSession() {
	return useQuery<Session | null>({
		queryKey: sessionKeys.all,
		queryFn: async () => {
			const { data, error } = await authClient.getSession();
			if (error) throw error;
			return data;
		},
		staleTime: 1000 * 60 * 5,
		retry: false,
	});
}
