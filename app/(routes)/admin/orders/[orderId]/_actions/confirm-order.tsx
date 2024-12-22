"use server";

import { updateStocks } from "@/actions/update-stocks";
import { SHIPPING_ONLY } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import { revalidateOrders } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";

const confirmOrderSchema = z.object({
  confirm: z.boolean(),
  id: z.string(),
});

async function confirmOrder(data: z.infer<typeof confirmOrderSchema>) {
  return await safeServerAction({
    schema: confirmOrderSchema,
    data,
    roles: SHIPPING_ONLY,
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

      revalidateOrders();

      return {
        success: true,
        message: "Commande confirmé",
      };
    },
  });
}

export default confirmOrder;
