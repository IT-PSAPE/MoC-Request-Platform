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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  async function onLogin(email: string, password: string) {
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const ok = await login(email, password);
      const next = searchParams.get("next") ?? "/admin";

      if (ok) {
        router.push(next);
        router.refresh(); // Ensure server state is updated
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    onLogin(email, password);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
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
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        required
      />
      <Input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
        required
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
