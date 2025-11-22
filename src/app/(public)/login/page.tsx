import type { Metadata } from "next";
import { Suspense } from "react";
import Card from "@/components/common/cards/card";
import LoginFormContainer from "@/components/common/login-form";
import Loader from "@/components/common/loader";

export const metadata: Metadata = {
  title: "Admin Login | MOC Request Platform",
  description: "Authenticate to access the Ministry of Culture admin workspace for reviewing requests.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-[384px] py-16">
      <Card title="Admin Login">
        <Suspense fallback={<Loader />}>
          <LoginFormContainer />
        </Suspense>
      </Card>
    </div>
  );
}
