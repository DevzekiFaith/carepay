import type { Metadata } from "next";
import Nav from "./components/Nav";
import MobileBottomNav from "./components/MobileBottomNav";
import RootWrapper from "./components/RootWrapper";
import WhatsAppButton from "./components/WhatsAppButton";
import "./globals.css";
import { Toaster } from "sonner";
import {
  DEFAULT_CITY,
  DEFAULT_COUNTRY,
  DEFAULT_STATE,
  SITE_NAME,
  getSiteUrl,
} from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: `${SITE_NAME} — Book it. Fix it. Done.`,
    template: `%s | ${SITE_NAME}`,
  },
  description: `Plumbers, electricians, carpenters & more in ${DEFAULT_CITY}. Book in 2 mins. Vetted pros across ${DEFAULT_STATE}, ${DEFAULT_COUNTRY}.`,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Book it. Fix it. Done.`,
    description: `Book trusted handymen in ${DEFAULT_CITY}.`,
    locale: "en_NG",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Book it. Fix it. Done.`,
    description: `Book trusted handymen in ${DEFAULT_CITY}.`,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE_NAME,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="min-w-0 overflow-x-hidden font-sans antialiased"
      >
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-stone-900 focus:shadow-lg focus:ring-2 focus:ring-violet-200"
        >
          Skip to content
        </a>
        <Nav />
        <RootWrapper>
          <div id="content">{children}</div>
        </RootWrapper>
        <MobileBottomNav />
        <WhatsAppButton />
        <Toaster position="top-center" richColors />
        {/* PWA service worker registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(err){console.warn('SW registration failed:',err)})})}`,
          }}
        />
      </body>
    </html>
  );
}
