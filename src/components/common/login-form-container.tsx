"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/contexts/auth-context";
import { useState } from "react";
import Button from "./button";

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
  return (

    <form
      onSubmit={(e) => {
        e.preventDefault();
        onLogin(email, password);
      }}
      className="space-y-3"
    >
      <p className="text-sm text-foreground/70">Only MoC Members can login</p>
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm focus:outline-none"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm focus:outline-none"
      />
      <Button type="submit">Login</Button>
    </form>
  );
}
