'use client';

import Image from "next/image";
import Link from "next/link";
import SmartRedirect from "@/components/navigation/smart-redirect";
import { PublicCard, Button, Text } from "@/components/ui/";

export default function HomePageClient() {
  return (
    <SmartRedirect>
      <div className="isolate relative h-full w-full">
        <div className="absolute top-0 left-0 right-0 w-full h-full -z-10 overflow-hidden">
          <Image src="/images/public-home-bg.avif" alt="Background image" fill priority sizes="100vw" className="object-cover" />
        </div>
        <div className="py-10 w-full flex-1 flex items-center w-full mx-auto max-w-container text-left space-y-20 px-4">
          <div className="w-full flex flex-col items-center space-y-2 text-center">
            <Text style="title-h1" className="text-brand-secondary" >MOC Request Platform</Text>
            <Text style="paragraph-md" className="text-tertiary max-w-[50ch]">The Ministry of Culture invites all members to submit their requests for assistance. We are here to support you and will do our best to provide the help you need.</Text>
          </div>
          <div className="mx-auto w-full grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <HomeCard
              href="/form"
              icon={<span className="text-xl" aria-hidden>✍️</span>}
              title="Submit a Request"
              description="Create a new request using the 5W1H format."
              cta="Go to form"
            />
            <HomeCard
              href="/board"
              icon={<span className="text-xl" aria-hidden>🗂️</span>}
              title="View Requests"
              description="Browse and track progress in a Kanban view."
              cta="Open board"
            />
          </div>
        </div>
      </div>
    </SmartRedirect>
  );
}

function HomeCard({ href, icon, title, description, cta }: { href: string, icon: React.ReactNode, title: string, description: string, cta: string }) {
  return (
    <Link href={href} className="block group h-full">
      <PublicCard className="h-full rounded-xl border hover:shadow-lg transition-shadow">
        <div className="flex h-full flex-col items-start text-left gap-4">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-quaternary">
            {icon}
          </div>
          <Text style="title-h6">{title}</Text>
          <Text style="paragraph-sm" className="text-tertiary">{description}</Text>
          <Button type="button" variant="secondary" className="w-full mt-6">{cta}</Button>
        </div>
      </PublicCard>
    </Link>
  )
}