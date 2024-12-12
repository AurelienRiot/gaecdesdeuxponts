import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

const farmShopId = process.env.NEXT_PUBLIC_FARM_ID;

const getShops = unstable_cache(
  async () => {
    const [shops, farmShop] = await Promise.all([
      prismadb.shop.findMany({
        where: {
          isArchived: false,
          id: {
            not: farmShopId,
          },
        },
        include: {
          links: true,
          shopHours: { orderBy: { day: "asc" } },
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prismadb.shop.findUnique({
        where: { id: farmShopId },
        include: {
          links: true,
          shopHours: { orderBy: { day: "asc" } },
        },
      }),
    ]);

    return { shops, farmShop };
  },
  ["getShops"],
  { revalidate: 60 * 60 * 24 * 7, tags: ["shops"] },
);

export default getShops;
