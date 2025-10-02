"use client";
import { useRouter, useSearchParams } from "next/navigation";
import LoginForm from "./LoginForm";
import { useAuthContext } from "@/components/providers/auth-provider";

export default function LoginFormContainer() {
  const { login } = useAuthContext();

  const router = useRouter();
  const searchParams = useSearchParams();

  async function onLogin(email: string, password: string) {
    const ok = await login(email, password);
    const next = searchParams.get("next") ?? "/admin";

    if (ok) router.push(next);
  }
  return <LoginForm onLogin={onLogin} />;
}
