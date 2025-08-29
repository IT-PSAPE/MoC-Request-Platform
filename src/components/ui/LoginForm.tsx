"use client";
import { useState } from "react";
import Button from "./Button";

export default function LoginForm({ onLogin }: { onLogin: (password: string) => void }) {
  const [password, setPassword] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onLogin(password);
      }}
      className="space-y-3"
    >
      <p className="text-sm text-foreground/70">Demo-only authentication. Use password: <code>admin</code>.</p>
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
