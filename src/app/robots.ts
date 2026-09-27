import type { MetadataRoute } from "next";
import { indexingAllowed, siteUrl } from "@/lib/site-config";

/**
 * `robots.txt`. Staging/demo (по умолчанию) — полный запрет индексации
 * для всех роботов; production (`NEXT_PUBLIC_SITE_ENV=production`) —
 * разрешение с исключением разделов, которые не индексируются намеренно
 * (личный кабинет, запись, вход — см. `robots: { index: false }` на них).
 */
export default function robots(): MetadataRoute.Robots {
  if (!indexingAllowed) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/account", "/booking", "/login"] }],
    sitemap: siteUrl ? `${siteUrl}/sitemap.xml` : undefined,
  };
}
