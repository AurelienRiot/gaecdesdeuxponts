import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

export const getShop = unstable_cache(
  async (id: string) => {
    return await prismadb.shop.findUnique({
      where: { id, isArchived: false },
      include: { links: true, shopHours: true },
    });
  },
  ["getShop"],
  { revalidate: false, tags: ["shops"] },
);
