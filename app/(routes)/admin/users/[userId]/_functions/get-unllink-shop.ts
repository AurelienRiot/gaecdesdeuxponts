"use server";

import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

const getUnlinkShop = unstable_cache(
  async () => {
    return await prismadb.shop.findMany({
      where: {
        userId: null,
      },
      orderBy: { name: "asc" },
    });
  },
  ["getUnlinkShop"],
  { revalidate: 60 * 60 * 24 * 7, tags: ["shops"] },
);

export default getUnlinkShop;
