import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import RootProvider from "@/providers/root-provider";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MOC Request Platform",
  description: "Submit, track, and process requests",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" className={manrope.className} suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased flex flex-col h-screen bg-secondary overflow-hidden max-md:overflow-auto max-md:h-fit">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
