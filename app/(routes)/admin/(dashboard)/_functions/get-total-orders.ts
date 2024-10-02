import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

export const getTotalOrders = unstable_cache(
  async ({ startDate, endDate }: { startDate: Date; endDate: Date }) => {
    return await prismadb.order.findMany({
      where: {
        dateOfShipping: {
          gte: startDate,
          lte: endDate,
        },
        shippingEmail: {
          not: null,
        },
        deletedAt: null,
      },
      select: {
        totalPrice: true,
        orderItems: { select: { quantity: true, name: true, price: true, tax: true } },
        user: { select: { name: true, id: true } },
      },
    });
  },
  ["getDashboardTotalOrders"],
  { revalidate: 60 * 60 * 10, tags: ["orders", "users"] },
);
