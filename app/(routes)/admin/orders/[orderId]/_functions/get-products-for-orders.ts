import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

export type ProductsForOrdersType = Awaited<ReturnType<typeof getProductsForOrders>>;

const getProductsForOrders = unstable_cache(
  async () => {
    const products = await prismadb.product.findMany({
      where: {
        product: {
          categoryName: {
            not: "Produits AMAP",
          },
        },
      },
      include: {
        product: true,
        stocks: true,
      },
    });

    const sortedProducts = products.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    return sortedProducts;
  },
  ["get-products-for-orders"],
  { revalidate: 60 * 60 * 24 * 7, tags: ["products", "categories", "stocksName"] },
);
export default getProductsForOrders;
