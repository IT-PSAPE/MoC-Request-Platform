"use client";
import { useState } from "react";
import Button from "./Button";

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onLogin(email, password);
      }}
      className="space-y-3"
    >
      <p className="text-sm text-foreground/70">Demo-only authentication. Use password: <code>admin</code>.</p>
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
