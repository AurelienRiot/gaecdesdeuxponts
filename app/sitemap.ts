import type { MetadataRoute } from "next";
import { getCategories } from "@/actions/get-category";
import { getProducts } from "@/actions/get-products";
import { makeCategoryUrl, makeProductUrl } from "@/components/product/product-function";
import getShops from "@/actions/get-shops";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.laiteriedupontrobert.fr";
  const lastModified = new Date("2024-12-12");

  const [products, categories, shops] = await Promise.all([getProducts(), getCategories(), getShops()]);

  const shopsSitemap = shops.shops.map((shop) => ({
    url: `${baseUrl}/ou-nous-trouver/${shop.id}`,
    lastModified: shop.updatedAt,
  }));

  const productsSitemap = products.map((product) => ({
    url:
      baseUrl +
      makeProductUrl({
        isPro: product.product.isPro,
        productName: product.product.name,
        categoryName: product.product.categoryName,
        options: product.options,
        parsing: true,
      }),
    lastModified: product.updatedAt,
  }));

  const categoriesSitemap = categories.map((category) => ({
    url: baseUrl + makeCategoryUrl(category.name, false),
    lastModified: category.updatedAd,
  }));

  return [
    {
      url: baseUrl,
      lastModified,
    },
    {
      url: `${baseUrl}/login`,
      lastModified,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified,
    },
    {
      url: `${baseUrl}/la-ferme`,
      lastModified,
    },
    {
      url: `${baseUrl}/lait-cru`,
      lastModified,
    },
    {
      url: `${baseUrl}/ou-nous-trouver`,
      lastModified,
    },
    ...categoriesSitemap,
    ...productsSitemap,
    ...shopsSitemap,
  ];
}
