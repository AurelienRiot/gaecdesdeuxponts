import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: ["/admin/", "/profile/"],
    },
    sitemap: "https://www.laiteriedupontrobert.fr/sitemap.xml",
  };
}
