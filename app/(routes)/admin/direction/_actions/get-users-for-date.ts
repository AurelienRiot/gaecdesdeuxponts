"use server";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { addressFormatter } from "@/lib/utils";
import { z } from "zod";
import type { Point } from "../_components/direction-schema";
import { READ_ONLY_ADMIN } from "@/components/auth";

const schema = z.object({
  from: z.date(),
  to: z.date(),
});

async function getUsersForDate(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    roles: READ_ONLY_ADMIN,
    schema,
    serverAction: async ({ from, to }) => {
      const orders = await prismadb.order.findMany({
        where: {
          dateOfShipping: {
            gte: from,
            lt: to,
          },
          deletedAt: null,
        },
        select: {
          shop: true,
          user: { include: { address: true } },
        },
      });
      const formattedOrders: Point[] = orders.map((order) => ({
        label: order.shop ? order.shop.address : addressFormatter(order.user.address, false),
        longitude: order.shop ? order.shop.long : order.user.address?.longitude,
        latitude: order.shop ? order.shop.lat : order.user.address?.latitude,
      }));
      return { success: true, data: formattedOrders, message: "Commandes trouvées" };
    },
  });
}

export default getUsersForDate;
