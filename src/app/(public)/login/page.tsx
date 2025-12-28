import type { Metadata } from "next";
import { Suspense } from "react";
import { PublicCard, Loader } from "@/components/ui";
import { LoginFormContainer } from "@/feature/auth";

export const metadata: Metadata = {
  title: "Admin Login | MOC Request Platform",
  description: "Authenticate to access the Ministry of Culture admin workspace for reviewing requests.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-[384px] py-16">
      <PublicCard title="Admin Login">
        <Suspense fallback={<Loader />}>
          <LoginFormContainer />
        </Suspense>
      </PublicCard>
    </div>
  );
}
