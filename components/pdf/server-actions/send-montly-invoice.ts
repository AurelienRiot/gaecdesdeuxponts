"use server";
import { checkAdmin } from "@/components/auth/checkAuth";
import { getAndSendMonthlyInvoice } from "@/components/pdf/server-actions/get-and-send-monthly-invoice";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";

const monthlyInvoiceSchema = z.object({
  orderIds: z.array(z.string()),
});

export async function sendMonthlyInvoice(data: z.infer<typeof monthlyInvoiceSchema>) {
  return await safeServerAction({
    data,
    schema: monthlyInvoiceSchema,
    getUser: checkAdmin,
    serverAction: async ({ orderIds }) => {
      // await addDelay(2000);
      return getAndSendMonthlyInvoice(orderIds);
    },
  });
}
