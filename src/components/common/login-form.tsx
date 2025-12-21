"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/components/contexts/auth-context";
import { useActionState } from "react";
import Button from "./controls/button";
import Input from "./controls/input";
import Text from "./text";

export default function LoginFormContainer() {
  const { login } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  // React 19 Actions API with useActionState
  const [error, loginAction, isPending] = useActionState(
    async (previousState: string | null, formData: FormData) => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      if (!email?.trim() || !password?.trim()) {
        return "Please enter both email and password";
      }

      try {
        const ok = await login(email, password);
        const next = searchParams.get("next") ?? "/admin";

        if (ok) {
          router.push(next);
          router.refresh(); // Ensure server state is updated
          return null; // Success
        }
        return "Login failed. Please try again.";
      } catch (err) {
        console.error("Login error:", err);
        return "Invalid email or password. Please try again.";
      }
    },
    null
  );

  return (
    <form action={loginAction} className="space-y-3">
      <Text style="paragraph-sm">Only MoC Members can login</Text>
      
      {error && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200">
          <Text style="paragraph-sm" className="text-red-800">
            {error}
          </Text>
        </div>
      )}
      
      <Input
        type="email"
        name="email"
        placeholder="email"
        disabled={isPending}
        required
      />
      <Input
        type="password"
        name="password"
        placeholder="password"
        disabled={isPending}
        required
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
