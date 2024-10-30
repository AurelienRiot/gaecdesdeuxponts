"use server";
import { ADMIN, SHIPPING_ONLY } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";
import { createInvoice, sendInvoice } from "./create-and-send-invoice";

const createInvoiceSchema = z.object({
  orderIds: z.array(z.string()),
  sendEmail: z.boolean(),
});

export async function createInvoiceAction(data: z.infer<typeof createInvoiceSchema>) {
  return await safeServerAction({
    data,
    schema: createInvoiceSchema,
    roles: SHIPPING_ONLY,
    serverAction: async ({ orderIds, sendEmail }) => {
      // await addDelay(2000);
      const previousInvoice = await prismadb.invoice.findFirst({
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });
      const invoice = await createInvoice(orderIds, previousInvoice?.id || null);
      if (!invoice.success) {
        return invoice;
      }
      if (!sendEmail) {
        return invoice;
      }
      if (!invoice.data) {
        return {
          success: false,
          message: "Une erreur est survenue lors de l'envoi de la facture",
        };
      }
      return await sendInvoice(invoice.data.invoiceId);
    },
  });
}

const monthlyInvoiceSchema = z.object({
  invoiceId: z.string(),
  reminder: z.boolean().optional(),
});

export async function sendInvoiceAction(data: z.infer<typeof monthlyInvoiceSchema>) {
  return await safeServerAction({
    data,
    schema: monthlyInvoiceSchema,
    roles: ADMIN,
    serverAction: async ({ invoiceId, reminder }) => {
      // await addDelay(2000);
      return await sendInvoice(invoiceId, reminder);
    },
  });
}
