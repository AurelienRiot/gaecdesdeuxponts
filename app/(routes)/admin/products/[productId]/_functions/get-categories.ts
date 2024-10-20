"server only";

import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

export const getCategoriesForProducts = unstable_cache(
  async () => {
    return await prismadb.category.findMany();
  },
  ["getCategoriesForProducts"],
  { revalidate: 60 * 60 * 24, tags: ["categories"] },
);
