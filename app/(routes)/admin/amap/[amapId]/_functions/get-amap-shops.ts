"server only";

import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

const getAmapShops = unstable_cache(
  async () => {
    return (await prismadb.shop.findMany({ where: { type: "amap" } })).sort((a, b) =>
      (a.name || "").localeCompare(b.name || ""),
    );
  },
  ["getAmapShops"],
  {
    revalidate: 60 * 60 * 24 * 7,
    tags: ["shops"],
  },
);

export default getAmapShops;
