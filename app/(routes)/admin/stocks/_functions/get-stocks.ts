"server only";

import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

export const getStocks = unstable_cache(
  async () => {
    return await prismadb.stock.findMany({ orderBy: [{ index: "asc" }, { name: "asc" }] });
  },
  ["getStocks"],
  { revalidate: 60 * 60 * 24, tags: ["stocks"] },
);
