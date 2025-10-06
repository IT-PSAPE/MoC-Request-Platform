import { Suspense } from "react";
import Card from "@/components/ui/Card";
import LoginFormContainer from "@/components/ui/LoginFormContainer";
import Loader from "@/components/ui/loader";

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
