import  type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/category/*", "/login", "/contact", "/faq", "/la-ferme"],
      disallow: ["/admin/", "/dashboard-user/"],
    },
    sitemap: "https://www.laiteriedupontrobert.fr/sitemap.xml",
  };
}
