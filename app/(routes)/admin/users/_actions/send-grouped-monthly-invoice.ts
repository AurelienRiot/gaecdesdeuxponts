"use server";
import { checkAdmin } from "@/components/auth/checkAuth";
import { getAndSendMonthlyInvoice } from "@/components/pdf/server-actions/get-and-send-monthly-invoice";
import safeServerAction from "@/lib/server-action";
import { addDelay } from "@/lib/utils";
import { z } from "zod";

const groupedMonthlyInvoiceSchema = z.array(z.array(z.string()));

export default async function sendGroupedMonthlyInvoice(data: z.infer<typeof groupedMonthlyInvoiceSchema>) {
  return await safeServerAction({
    data,
    schema: groupedMonthlyInvoiceSchema,
    getUser: checkAdmin,
    serverAction: async (orderArray) => {
      // await addDelay(2000);
      const monthlyInvoice = await Promise.all(
        orderArray.map(async (orderIds) =>
          //  await addDelay(3000).then(() => ({ success: true })),
          getAndSendMonthlyInvoice(orderIds),
        ),
      );
      return monthlyInvoice.every((invoice) => invoice.success)
        ? { success: true, message: "Toutes les factures sont envoyées" }
        : { success: false, message: "Une erreur est survenue lors de l'envoi des factures" };
    },
  });
}
