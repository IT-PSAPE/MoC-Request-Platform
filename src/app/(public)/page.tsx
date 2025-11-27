import type { Metadata } from "next";
import HomePageClient from "@/features/public-home/home-page-client";

export const metadata: Metadata = {
  title: "MOC Request Platform",
  description: "Explore how to submit or review Ministry of Culture assistance requests through the online platform.",
};

export default function PublicHome() {
  return <HomePageClient />;
}
