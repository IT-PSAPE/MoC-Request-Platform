import type { Metadata } from "next";
import { Suspense } from "react";
import Card from "@/components/common/cards/card";
import LoginFormContainer from "@/components/common/lgoin-form";
import Loader from "@/components/common/loader";

export const metadata: Metadata = {
  title: "Admin Login | MOC Request Platform",
  description: "Sign in to the MOC Request Platform to review submissions, update statuses, and manage venues, equipment, and songs.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm py-16">
      <Card title="Admin Login">
        <Suspense fallback={<Loader />}>
          <LoginFormContainer />
        </Suspense>
      </Card>
    </div>
  );
}
