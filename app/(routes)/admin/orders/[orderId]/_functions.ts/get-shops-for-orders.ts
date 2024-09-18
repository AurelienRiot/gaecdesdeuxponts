import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

const getShopsForOrders = unstable_cache(
  async () => {
    const shops = await prismadb.shop
      .findMany({})
      .then((shops) => shops.sort((a, b) => (a.name || "").localeCompare(b.name || "", "fr", { sensitivity: "base" })));

    return shops;
  },
  ["getShopsForOrders"],
  { revalidate: 60 * 60 * 24, tags: ["shops"] },
);

export default getShopsForOrders;
