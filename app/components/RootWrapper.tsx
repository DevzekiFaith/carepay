"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

import dynamic from "next/dynamic";

const CartDrawer = dynamic(() => import("./CartDrawer"), { ssr: false });
const PromoOverlay = dynamic(() => import("./PromoOverlay"), { ssr: false });
const WhatsAppButton = dynamic(() => import("./WhatsAppButton"), { ssr: false });

export default function RootWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Define paths where footer should be hidden (focused/minimalist views)
  const hideFooterPaths = [
    "/", // The Cover Page / Landing
    "/auth/customer/login",
    "/auth/customer/register",
    "/auth/worker/login",
    "/auth/worker/register",
  ];

  const shouldHideFooter = hideFooterPaths.includes(pathname);

  return (
    <>
      {children}
      {!shouldHideFooter && <Footer />}
      <CartDrawer />
      <PromoOverlay />
      <WhatsAppButton />
    </>
  );
}
