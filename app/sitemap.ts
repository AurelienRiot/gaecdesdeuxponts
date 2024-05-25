import { getCategories } from "@/actions/get-category";
import { getProducts } from "@/actions/get-products";
import {
  makeCategoryUrl,
  makeProductUrl,
} from "@/components/product/product-function";

export default async function sitemap() {
  const baseUrl = "https://www.laiteriedupontrobert.fr";

  const products = await getProducts();
  const categories = await getCategories();

  const productsSitemap = products.map((product) => ({
    url:
      baseUrl +
      makeProductUrl({
        productName: product.product.name,
        categoryName: product.product.categoryName,
        isPro: product.product.isPro,
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
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "weekly",
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "weekly",
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "weekly",
    },
    {
      url: `${baseUrl}/la-ferme`,
      lastModified: new Date(),
      changeFrequency: "weekly",
    },
    ...productsSitemap,
    ...categoriesSitemap,
  ];
}
