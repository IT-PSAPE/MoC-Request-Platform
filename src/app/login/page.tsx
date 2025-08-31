import Card from "@/components/ui/Card";
import LoginFormContainer from "@/components/ui/LoginFormContainer";

export default function LoginPage({ searchParams }: { searchParams?: { [key: string]: string | undefined } }) {
  const next = searchParams?.next || "/admin";
  return (
    <div className="mx-auto max-w-sm py-16">
      <Card title="Admin Login">
        <LoginFormContainer next={next} />
      </Card>
    </div>
  );
}
