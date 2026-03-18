export const SITE_NAME = "CarePay";

// Set this in production (e.g. https://carepay.ng)
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://carepay.example";

export const DEFAULT_CITY = "Enugu";
export const DEFAULT_STATE = "Enugu State";
export const DEFAULT_COUNTRY = "Nigeria";

export function getSiteUrl() {
  // Ensure this always returns a valid absolute URL.
  try {
    return new URL(SITE_URL);
  } catch {
    return new URL("https://carepay.example");
  }
}

