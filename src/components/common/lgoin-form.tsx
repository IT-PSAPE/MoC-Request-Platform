"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/contexts/auth-context";
import { useState } from "react";
import Button from "./button";
import Input from "./forms/input";
import Text from "./text";

export default function LoginFormContainer() {
  const { login } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  async function onLogin(email: string, password: string) {
    const ok = await login(email, password);
    const next = searchParams.get("next") ?? "./admin";

    if (ok) router.push(next);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    onLogin(email, password);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Text style="paragraph-sm">Only MoC Members can login</Text>
      <Input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit">Login</Button>
    </form>
  );
}
