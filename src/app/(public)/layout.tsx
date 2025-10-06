import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "../../app/globals.css";
import RootProvider from "@/components/root-provider";
import NavigationBar from "@/components/navigation-bar";

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
      <body suppressHydrationWarning className={`antialiased flex flex-col h-screen bg-primary`} >
        <RootProvider>
          <NavigationBar />
          <main className="mx-auto w-full flex flex-col h-full min-h-0 overflow-x-auto"> {children} </main>
        </RootProvider>
      </body>
    </html>
  );
}
