"use server";

import { updateStocks } from "@/actions/update-stocks";
import createOrdersEvent from "@/components/google-events/create-orders-event";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const confirmOrderSchema = z.object({
  confirm: z.boolean(),
  id: z.string(),
});

async function confirmOrder(data: z.infer<typeof confirmOrderSchema>) {
  return await safeServerAction({
    schema: confirmOrderSchema,
    data,
    roles: ["admin"],
    serverAction: async ({ confirm, id }) => {
      const order = await prismadb.order.update({
        where: {
          id,
        },
        data: {
          shippingEmail: confirm ? new Date() : null,
        },
        select: { id: true, orderItems: { select: { stocks: true, quantity: true } } },
      });
      await updateStocks(order.orderItems, !confirm);

      await createOrdersEvent({ date: new Date() });
      revalidateTag("orders");

      return {
        success: true,
        message: "Commande confirmé",
      };
    },
  });
}

export default confirmOrder;
