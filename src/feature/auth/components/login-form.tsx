"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/feature/auth/components/auth-context";
import { useActionState } from "react";
import { Button, TextInput, Text } from "@/components/ui";

export function LoginFormContainer() {
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
    <div className="w-full max-w-md mx-auto">
      {/* Logo and Icon */}
      {/* <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mr-3">
          <div className="w-6 h-6 bg-white rounded-sm"></div>
        </div>
        <div className="text-2xl font-bold text-gray-900">MOC</div>
      </div> */}

      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
        <Text style="paragraph-sm" className="text-gray-600">
          Ministry of Culture Request Platform
        </Text>
      </div>

      <form action={loginAction} className="space-y-4">
        {error && (
          <div className="p-3 rounded-md bg-red-50 border border-red-200">
            <Text style="paragraph-sm" className="text-red-800">
              {error}
            </Text>
          </div>
        )}

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Enter email
          </label>
          <TextInput
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            disabled={isPending}
            required
          />
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <TextInput
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            disabled={isPending}
            required
          />
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full"
        >
          {isPending ? "Signing in..." : "Continue"}
        </Button>
      </form>

      {/* Footer Links */}
      {/* <div className="mt-6 text-center">
        <Text style="paragraph-sm" className="text-gray-600">
          By continuing, you agree to our{" "}
          <a href="#" className="text-purple-600 hover:text-purple-700 underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="text-purple-600 hover:text-purple-700 underline">
            Privacy Policy
          </a>
        </Text>
      </div> */}

      {/* <div className="mt-4 text-center">
        <Text style="paragraph-sm" className="text-gray-600">
          Don't have an account?{" "}
          <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
            Sign up
          </a>
        </Text>
      </div> */}
    </div>
  );
}
