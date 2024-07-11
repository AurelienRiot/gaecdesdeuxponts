"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";

const schema = z.object({
  orderIds: z.array(z.string()),
  isPaid: z.boolean(),
});

async function montlyInvoicePaid(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    schema,
    getUser: checkAdmin,
    serverAction: async () => {
      await prismadb.order.updateMany({
        where: {
          id: {
            in: data.orderIds,
          },
        },
        data: {
          dateOfPayment: data.isPaid ? new Date() : null,
        },
      });

      return {
        success: true,
        message: "Date de paiement enregistrée",
      };
    },
  });
}

export default montlyInvoicePaid;
