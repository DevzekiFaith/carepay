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

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
