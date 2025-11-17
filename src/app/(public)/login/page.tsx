import { Suspense } from "react";
import Card from "@/components/common/cards/card";
import LoginFormContainer from "@/components/common/lgoin-form";
import Loader from "@/components/common/loader";

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
