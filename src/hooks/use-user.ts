import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "#/lib/auth-client.ts";
import { sessionKeys } from "./use-session";

type UpdateUserInput = {
  name?: string;
  image?: string;
};

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateUserInput) => {
      const { data, error } = await authClient.updateUser(input);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate session so the cached user data refreshes
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}
