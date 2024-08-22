import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

const farmShopId = process.env.NEXT_PUBLIC_FARM_ID;

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
    const farmShop = await prismadb.shop.findUnique({
      where: { id: farmShopId },
    });
    return { shops, farmShop };
  },
  ["getShops"],
  { revalidate: 60 * 60 * 24, tags: ["shops"] },
);

export default getShops;
