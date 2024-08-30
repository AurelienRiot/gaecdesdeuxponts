import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

export const getOrdersByDateOfShipping = unstable_cache(
  async ({ beginMonth, endMonth }: { beginMonth: Date; endMonth: Date }) => {
    return await prismadb.order
      .findMany({
        where: {
          dateOfShipping: {
            gte: beginMonth,
            lt: endMonth,
          },
        },
        select: {
          dateOfShipping: true,
        },
        distinct: ["dateOfShipping"],
      })
      .then((orders) => {
        return orders.map((order) => order.dateOfShipping).filter((date): date is Date => date instanceof Date);
      });
  },
  ["getOrdersByDateOfShipping"],
  { revalidate: 60 * 60 * 24, tags: ["orders"] },
);
