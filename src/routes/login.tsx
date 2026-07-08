import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LoginForm } from "#/components/login-form.tsx";
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
  return <LoginForm />;
}
