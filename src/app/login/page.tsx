import Card from "@/components/ui/Card";
import LoginFormContainer from "@/components/ui/LoginFormContainer";

type LoginPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const nextParam = searchParams?.next;
  const next = Array.isArray(nextParam) ? nextParam[0] : nextParam ?? "/admin";

  return (
    <div className="mx-auto max-w-sm py-16">
      <Card title="Admin Login">
        <LoginFormContainer next={next} />
      </Card>
    </div>
  );
}
