"use server";
import { ADMIN } from "@/components/auth";
import { createInvoice } from "@/components/pdf/server-actions/create-and-send-invoice";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const groupedMonthlyInvoiceSchema = z.array(z.array(z.string()));

export default async function createGroupedMonthlyInvoice(data: z.infer<typeof groupedMonthlyInvoiceSchema>) {
  return await safeServerAction({
    data,
    schema: groupedMonthlyInvoiceSchema,
    roles: ADMIN,
    serverAction: async (orderArray) => {
      const previousInvoice = await prismadb.invoice.findFirst({
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });
      let previousInvoiceId = previousInvoice?.id || null;
      const monthlyInvoices: { success: boolean; message: string; data?: string }[] = [];
      for (const orderIds of orderArray) {
        const invoice = await createInvoice(orderIds, previousInvoiceId);

        if (!invoice.success) {
          console.log(invoice.message);
          monthlyInvoices.push(invoice);
          continue; // Continue processing other orders or decide to break
        }

        if (!invoice.data) {
          monthlyInvoices.push({
            success: false,
            message: "Une erreur est survenue lors de la création de la facture",
          });
          continue;
        }

        previousInvoiceId = invoice.data.invoiceId;
        monthlyInvoices.push({ success: true, message: "", data: invoice.data.invoiceId });
      }

      const allSuccess = monthlyInvoices.every((invoice) => invoice.success);

      const allIds = monthlyInvoices.map((invoice) => invoice.data);

      revalidateTag("invoices");
      revalidateTag("orders");
      revalidateTag("users");
      return allSuccess
        ? { success: true, message: "Toutes les factures ont été créées", data: allIds }
        : { success: false, message: "Une erreur est survenue lors de la création des factures", data: allIds };
    },
  });
}
