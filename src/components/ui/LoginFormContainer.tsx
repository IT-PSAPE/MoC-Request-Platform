"use client";
import { useRouter } from "next/navigation";
import LoginForm from "./LoginForm";
import { useAuthContext } from "@/components/providers/auth-provider";

export default function LoginFormContainer({ next }: { next?: string }) {
  const { login } = useAuthContext();

  const router = useRouter();

  async function onLogin(email: string, password: string) {
    const ok = await login(email, password);
    
    if (ok) router.push(next || "/admin");
  }
  return <LoginForm onLogin={onLogin} />;
}
