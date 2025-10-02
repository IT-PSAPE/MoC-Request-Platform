import Card from "@/components/ui/Card";
import LoginFormContainer from "@/components/ui/LoginFormContainer";

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default function LoginPage(_: LoginPageProps) {
  return (
    <div className="mx-auto max-w-sm py-16">
      <Card title="Admin Login">
        <LoginFormContainer />
      </Card>
    </div>
  );
}
