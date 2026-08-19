import HomeClient from "./components/HomeClient";
import Gateway from "./components/Gateway";
import { createClient } from "@/lib/supabase/server";
import {
  DEFAULT_CITY,
  DEFAULT_COUNTRY,
  DEFAULT_STATE,
  SITE_NAME,
  getSiteUrl,
} from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let user = null;
  try {
    const supabase = await createClient();
    const timeout = new Promise<{ data: { user: null } }>((resolve) => setTimeout(() => resolve({ data: { user: null } }), 3000));
    const getUser = supabase.auth.getUser();
    const response = await Promise.race([getUser, timeout]);
    user = response?.data?.user ?? null;
  } catch (error) {
    console.error('Failed to fetch user from Supabase:', error);
    user = null;
  }

  const base = getSiteUrl();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    url: base.toString(),
    areaServed: [
      {
        "@type": "AdministrativeArea",
        name: DEFAULT_STATE,
      },
      {
        "@type": "City",
        name: DEFAULT_CITY,
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: DEFAULT_CITY,
      addressRegion: DEFAULT_STATE,
      addressCountry: DEFAULT_COUNTRY,
    },
    serviceType: [
      "Plumbing",
      "Electrical repair",
      "Carpentry",
      "Furniture making",
      "AC & fridge repair",
      "Painting",
      "General handyman",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {user ? <HomeClient /> : <Gateway />}
    </>
  );
}
