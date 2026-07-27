import type { MetadataRoute } from "next";
import { ADMIN_BASE_PATH } from "@/lib/admin-path";
import { getSiteUrl } from "@/lib/seo";

const baseUrl = getSiteUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", ADMIN_BASE_PATH, "/baskan", "/api", "/favoriler"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
