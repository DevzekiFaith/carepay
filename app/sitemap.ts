import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const routes = [
    "/",
    "/request",
    "/auth/customer/login",
    "/auth/customer/register",
    "/auth/worker/login",
    "/auth/worker/register",
    "/customer/dashboard",
    "/worker/dashboard",
  ];

  return routes.map((path) => ({
    url: new URL(path, base).toString(),
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.6,
  }));
}

