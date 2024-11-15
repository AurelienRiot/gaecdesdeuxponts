import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

export type AllShopsType = Awaited<ReturnType<typeof getAllShops>>;

export const getAllShops = unstable_cache(
  async () => {
    return await prismadb.shop.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      select: { id: true, name: true, imageUrl: true, address: true },
    });
  },
  ["getAllShops"],
  { revalidate: 60 * 60 * 24, tags: ["shops"] },
);
