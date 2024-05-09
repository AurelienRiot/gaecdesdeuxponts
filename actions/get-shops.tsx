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
  ["shops"],
  { revalidate: 60 * 10 },
);

export default getShops;
