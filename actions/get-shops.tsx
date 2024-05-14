import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

const getShops = unstable_cache(
  async () => {
    const shops = await prismadb.shop.findMany({
      where: {
        isArchived: false,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return shops;
  },
  ["getShops"],
  { revalidate: 60 * 60, tags: ["shops"] },
);

export default getShops;
