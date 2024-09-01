import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

export const getAllShops = unstable_cache(
  async () => {
    return await prismadb.shop.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      select: { name: true, imageUrl: true, address: true },
    });
  },
  ["getShops"],
  { revalidate: 60 * 60 * 24, tags: ["shops"] },
);
