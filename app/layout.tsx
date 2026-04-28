import type { Metadata } from "next";
import Nav from "./components/Nav";
import MobileBottomNav from "./components/MobileBottomNav";
import RootWrapper from "./components/RootWrapper";
import { CartProvider } from "@/lib/cart";
import "./globals.css";
import { Toaster } from "sonner";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import * as SiteConfig from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: SiteConfig.getSiteUrl(),
  title: {
    default: `${SiteConfig.SITE_NAME} — Book it. Fix it. Done.`,
    template: `%s | ${SiteConfig.SITE_NAME}`,
  },
  description: `Plumbers, electricians, carpenters & more in ${SiteConfig.DEFAULT_CITY}. Book in 2 mins. Vetted pros across ${SiteConfig.DEFAULT_STATE}, ${SiteConfig.DEFAULT_COUNTRY}.`,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SiteConfig.SITE_NAME,
    title: `${SiteConfig.SITE_NAME} — Book it. Fix it. Done.`,
    description: `Book trusted handymen in ${SiteConfig.DEFAULT_CITY}.`,
    locale: "en_NG",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SiteConfig.SITE_NAME} — Book it. Fix it. Done.`,
    description: `Book trusted handymen in ${SiteConfig.DEFAULT_CITY}.`,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SiteConfig.SITE_NAME,
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
        className={`${inter.variable} ${plusJakartaSans.variable} min-w-0 overflow-x-hidden font-sans antialiased`}
      >
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-stone-900 focus:shadow-lg focus:ring-2 focus:ring-violet-200"
        >
          Skip to content
        </a>
        <CartProvider>
          <Nav />
          <RootWrapper>
            <div id="content">{children}</div>
          </RootWrapper>
          <MobileBottomNav />
        </CartProvider>
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
