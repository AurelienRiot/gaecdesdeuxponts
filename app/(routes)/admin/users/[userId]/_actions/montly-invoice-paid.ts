"use server";

import safeServerAction from "@/lib/server-action";
import { z } from "zod";

const schema = z.object({
  orderIds: z.array(z.string()),
  date: z.date(),
  isPaid: z.boolean(),
});

async function montlyInvoicePaid(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    schema,
    roles: ["admin"],
    serverAction: async (data) => {
      const { date, orderIds, isPaid } = data;
      // await prismadb.order.updateMany({
      //   where: {
      //     id: {
      //       in: orderIds,
      //     },
      //   },
      //   data: {
      //     dateOfPayment: isPaid ? date : null,
      //   },
      // });

      // revalidateTag("orders");

      return {
        success: true,
        message: "Date de paiement enregistrée",
      };
    },
  });
}

export default montlyInvoicePaid;
