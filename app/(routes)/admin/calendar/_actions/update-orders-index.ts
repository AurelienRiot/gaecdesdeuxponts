"use server";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";

const schema = z.array(
  z.object({
    orderId: z.string(),
    index: z.number(),
  }),
);

async function updateOrdersIndex(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    roles: ["admin", "readOnlyAdmin"],
    schema,
    serverAction: async (orders) => {
      for (const order of orders) {
        await prismadb.order.update({
          where: { id: order.orderId },
          data: {
            index: order.index,
          },
        });
      }
      return {
        success: true,
        message: "",
      };
    },
  });
}

export default updateOrdersIndex;
