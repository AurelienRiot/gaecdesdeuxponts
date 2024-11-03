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

      let previousInvoiceId = previousInvoice?.id;
      const monthlyInvoices: ({ success: true; data: { invoiceId: string; name: string } } | { success: false })[] = [];
      for (const orderIds of orderArray) {
        const invoice = await createInvoice(orderIds, previousInvoiceId || null);

        if (!invoice.success) {
          console.log(invoice.message);
          monthlyInvoices.push(invoice);
          continue;
        }

        if (!invoice.data) {
          monthlyInvoices.push({
            success: false,
          });
          continue;
        }

        previousInvoiceId = invoice.data.invoiceId;
        monthlyInvoices.push({ success: true, data: invoice.data });
      }

      const allSuccess = monthlyInvoices.every((invoice) => invoice.success);

      // const allData = monthlyInvoices.map((invoice) => invoice.data);

      revalidateTag("invoices");
      revalidateTag("orders");
      revalidateTag("users");
      return {
        success: true,
        message: allSuccess
          ? "Toutes les factures ont été créées"
          : "Une erreur est survenue lors de la création des factures",
        data: monthlyInvoices,
      };
    },
  });
}
