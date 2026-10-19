import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

/** Solo la landing: las rutas de /app son `noindex` y están bloqueadas en robots.txt. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE.url, changeFrequency: "monthly", priority: 1 }];
}
