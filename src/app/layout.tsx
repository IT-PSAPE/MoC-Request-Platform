import type { Metadata } from "next";
import { Figtree, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavigationBar from "@/components/NavigationBar";

const figTree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MOC Request Platform",
  description: "Submit, track, and process requests",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${figTree.variable} ${figTree.variable} antialiased flex flex-col h-screen`}>
        <NavigationBar />
        <main className="mx-auto w-full flex flex-col h-full min-h-0 overflow-x-auto"> {children} </main>
      </body>
    </html>
  );
}
