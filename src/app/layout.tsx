import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import RootProvider from "@/components/providers/root-provider";

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

export const viewport:Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  userScalable: false,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" className={manrope.className} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MoC Requests" />
        <link rel="apple-touch-icon" href="/icons/icon-256x256.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512x512.png" />
        <link rel="mask-icon" href="/icons/icon-32x32.png" color="#ffffff" />
        
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-FNM0ZVKPTE" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-FNM0ZVKPTE');
            `,
          }}
        />
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  const swPath = '/sw.js';
                  
                  navigator.serviceWorker.register(swPath)
                    .then(function(registration) {
                      console.log('ServiceWorker registration successful with scope: ', registration.scope);
                      console.log('Using SW path:', swPath);
                    }, function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    });
                });
              }
            `,
          }}
        />
        <meta name="apple-mobile-web-app-title" content="MoC Requests" />
      </head>
      <body suppressHydrationWarning className="antialiased flex flex-col h-screen bg-secondary overflow-hidden max-md:overflow-auto max-md:h-fit">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
