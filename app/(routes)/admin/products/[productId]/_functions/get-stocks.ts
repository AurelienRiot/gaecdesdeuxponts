"server only";

import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

export const getStocksForProducts = unstable_cache(
  async () => {
    return await prismadb.stock.findMany({ orderBy: { index: "asc" } });
  },
  ["getStocksForProducts"],
  { revalidate: 60 * 60 * 24 * 7, tags: ["stocksName"] },
);
