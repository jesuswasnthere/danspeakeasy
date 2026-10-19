import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

/** Solo la landing es indexable: la app (/app) depende del estado local del alumno. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/app/", "/api/"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
