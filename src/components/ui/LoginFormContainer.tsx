"use client";
import { useRouter } from "next/navigation";
import { Auth } from "@/features/auth/auth";
import LoginForm from "./LoginForm";

export default function LoginFormContainer({ next }: { next?: string }) {
  const router = useRouter();
  function onLogin(password: string) {
    const ok = Auth.login(password);
    if (ok) router.push(next || "/admin");
  }
  return <LoginForm onLogin={onLogin} />;
}
