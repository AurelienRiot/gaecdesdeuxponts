import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: ["/admin/", "/dashboard-user/"],
    },
    sitemap: "https://www.laiteriedupontrobert.fr/sitemap.xml",
  };
}
