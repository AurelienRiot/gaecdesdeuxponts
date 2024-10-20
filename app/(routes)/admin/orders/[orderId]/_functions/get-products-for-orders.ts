import { priorityMap } from "@/components/product";
import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

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
      const aPriority = priorityMap[a.name] || Number.MAX_SAFE_INTEGER;
      const bPriority = priorityMap[b.name] || Number.MAX_SAFE_INTEGER;

      return aPriority - bPriority;
    });
    return sortedProducts;
  },
  ["get-products-for-orders"],
  { revalidate: 60 * 60 * 24, tags: ["productfetch"] },
);

export default getProductsForOrders;
