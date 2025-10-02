import Card from "@/components/ui/Card";
import LoginFormContainer from "@/components/ui/LoginFormContainer";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm py-16">
      <Card title="Admin Login">
        <LoginFormContainer />
      </Card>
    </div>
  );
}
