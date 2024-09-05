import prismadb from "@/lib/prismadb";
import type { AMAPOrder } from "@prisma/client";
import { unstable_cache } from "next/cache";

export const getAMAPOrders = unstable_cache(
  async ({ beginMonth, endMonth }: { beginMonth: Date; endMonth: Date }) => {
    return await prismadb.$queryRaw<AMAPOrder[]>`
    SELECT * FROM "AMAPOrder"
    WHERE EXISTS (
      SELECT 1 FROM unnest("shippingDays") AS date
      WHERE date >= ${beginMonth} AND date <= ${endMonth}
    );
  `.then((orders) => {
      console.log(orders[0]);
      return orders.flatMap((order) => order.shippingDays).filter((date): date is Date => date instanceof Date);
    });
  },
  ["getAMAPOrders"],
  { revalidate: 60 * 60 * 24, tags: ["amap-orders"] },
);
