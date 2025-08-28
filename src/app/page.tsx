import Link from "next/link";
import Card from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="py-10 flex-1">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold mb-2">MOC Request Platform</h1>
        <p className="text-foreground/80 mb-8">
          Submit requests, track progress, and manage work. Built with Next.js and Tailwind. No shadcn components.
        </p>

        <div className="mx-auto max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/submit" className="block">
            <Card className="h-full hover:shadow transition-shadow">
              <div className="flex flex-col items-center text-center gap-2 py-6">
                <div className="text-xl font-medium">Submit a Request</div>
                <div className="text-sm text-foreground/70">Create a new request using the 5W1H format.</div>
              </div>
            </Card>
          </Link>
          <Link href="/requests" className="block">
            <Card className="h-full hover:shadow transition-shadow">
              <div className="flex flex-col items-center text-center gap-2 py-6">
                <div className="text-xl font-medium">View Requests</div>
                <div className="text-sm text-foreground/70">Browse and track progress in a Kanban view.</div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
