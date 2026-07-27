import type { MetadataRoute } from "next";
import { ADMIN_BASE_PATH } from "@/lib/admin-path";

const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", ADMIN_BASE_PATH, "/baskan", "/api"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
