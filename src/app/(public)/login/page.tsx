import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader } from "@/components/ui";
import { LoginFormContainer } from "@/feature/auth";

export const metadata: Metadata = {
  title: "Admin Login | MOC Request Platform",
  description: "Authenticate to access the Ministry of Culture admin workspace for reviewing requests.",
};

export default function LoginPage() {
  return (
    <div className="flex h-full flex-1">
      {/* Left side - Login Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 lg:px-16 bg-white">
        <div className="max-w-md w-full mx-auto">
          <Suspense fallback={<Loader />}>
            <LoginFormContainer />
          </Suspense>
        </div>
      </div>
      
      {/* Right side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white p-8">
            <h2 className="text-4xl font-bold mb-4">Welcome to MOC</h2>
            <p className="text-lg opacity-90">Ministry of Culture Request Platform</p>
          </div>
        </div>
      </div>
    </div>
  );
}
