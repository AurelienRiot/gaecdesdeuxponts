"use server";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";

const schema = z.object({ userIds: z.array(z.string()), beginDay: z.date(), endDay: z.date() });

async function getOrdersIndex(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    roles: ["admin", "readOnlyAdmin"],
    schema,
    serverAction: async ({ userIds, beginDay, endDay }) => {
      const orders = await prismadb.order.findMany({
        where: {
          userId: {
            in: userIds,
          },
          dateOfShipping: {
            gte: beginDay,
            lt: endDay,
          },
          deletedAt: null,
        },
        select: { userId: true, index: true },
      });
      return {
        success: true,
        message: "",
        data: orders,
      };
    },
  });
}

export default getOrdersIndex;
