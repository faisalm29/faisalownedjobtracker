import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { sessionKeys } from "@/hooks/use-session";
import { authClient } from "@/lib/auth-client";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (creds: { email: string; password: string }) => {
      const { data, error } = await authClient.signIn.email(creds);
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Seed the session cache immediately — no refetch needed
      queryClient.setQueryData(sessionKeys.all, data);
      navigate({ to: "/applications" });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authClient.signOut(),
    onSuccess: () => {
      // Clear all cached data on logout
      queryClient.clear();
      navigate({ to: "/login" });
    },
  });
}
