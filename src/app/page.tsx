import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="py-10 w-full flex-1 flex items-center">
      <div className="w-full mx-auto max-w-3xl text-left space-y-20 px-4">
        <div className="w-full flex flex-col items-center space-y-2 text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">MOC Request Platform</h1>
          <p className="text-foreground/80 max-w-md">
            Submit requests, track progress, and manage work. Built with Next.js and Tailwind. No shadcn components.
          </p>
        </div>
        <div className="mx-auto w-full grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          <Link href="/form" className="block group h-full">
            <Card className="h-full rounded-xl border hover:shadow-lg transition-shadow">
              <div className="flex h-full flex-col items-start text-left gap-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/10">
                  <span className="text-xl" aria-hidden>✍️</span>
                </div>
                <div className="text-xl font-medium">Submit a Request</div>
                <div className="text-sm text-foreground/70 mb-6">Create a new request using the 5W1H format.</div>
                <Button type="button" variant="secondary" className="w-full">Go to form →</Button>
              </div>
            </Card>
          </Link>
          <Link href="/requests" className="block group h-full">
            <Card className="h-full rounded-xl border hover:shadow-lg transition-shadow">
              <div className="flex h-full flex-col items-start text-left gap-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/10">
                  <span className="text-xl" aria-hidden>🗂️</span>
                </div>
                <div className="text-xl font-medium">View Requests</div>
                <div className="text-sm text-foreground/70 mb-6">Browse and track progress in a Kanban view.</div>
                <Button type="button" variant="secondary" className="w-full">Open board →</Button>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
