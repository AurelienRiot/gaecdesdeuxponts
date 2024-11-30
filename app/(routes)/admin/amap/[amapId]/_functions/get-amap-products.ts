"server only";

import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

const getAmapProducts = unstable_cache(
  async () => {
    return await prismadb.product.findMany({ where: { productName: "Produits AMAP" } });
  },
  ["getAmapProducts"],
  {
    revalidate: 60 * 60 * 24 * 7,
    tags: ["products"],
  },
);

export default getAmapProducts;
