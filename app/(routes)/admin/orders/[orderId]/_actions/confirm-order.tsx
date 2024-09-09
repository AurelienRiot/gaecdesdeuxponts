"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
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
    getUser: checkAdmin,
    serverAction: async ({ confirm, id }) => {
      // await prismadb.order.update({
      //   where: {
      //     id,
      //   },
      //   data: {
      //     shippingEmail: confirm ? new Date() : null,
      //   },
      // });

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
