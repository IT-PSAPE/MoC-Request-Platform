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
  title: "MoC Request Platform",
  description: "Submit, track, and process requests for the Ministry of Culture",
  keywords: ["requests", "ministry of culture", "platform", "tracking"],
  authors: [{ name: "Ministry of Culture" }],
  creator: "Ministry of Culture",
  publisher: "Ministry of Culture",
  formatDetection: {
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MoC Requests",
  },
  openGraph: {
    type: "website",
    siteName: "MoC Request Platform",
    title: "MoC Request Platform",
    description: "Submit, track, and process requests for the Ministry of Culture",
  },
  twitter: {
    card: "summary",
    title: "MoC Request Platform", 
    description: "Submit, track, and process requests for the Ministry of Culture",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" className={manrope.className} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MoC Requests" />
        <link rel="apple-touch-icon" href="/images/request-platform-webclip.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/request-platform-favicon.png" />
        <link rel="icon" type="image/png" sizes="256x256" href="/images/request-platform-webclip.png" />
        <link rel="mask-icon" href="/images/request-platform-favicon.png" color="#2563eb" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    }, function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="antialiased flex flex-col h-screen bg-secondary overflow-hidden max-md:overflow-auto max-md:h-fit">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
