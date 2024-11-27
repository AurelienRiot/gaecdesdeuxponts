import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

export type AllShopsType = Awaited<ReturnType<typeof getAllShops>>;

export const getAllShops = unstable_cache(
  async () => {
    const shops = await prismadb.shop.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      select: { id: true, name: true, imageUrl: true, address: true, long: true, lat: true },
    });
    return shops.map((shop) => ({
      id: shop.id,
      name: shop.name,
      image: shop.imageUrl,
      address: shop.address,
      latitude: shop.lat,
      longitude: shop.long,
    }));
  },
  ["getAllShops"],
  { revalidate: 60 * 60 * 24, tags: ["shops"] },
);
