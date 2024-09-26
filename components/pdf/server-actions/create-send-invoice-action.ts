"use server";
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
    roles: ["admin"],
    serverAction: async ({ orderIds, sendEmail }) => {
      // await addDelay(2000);
      const previousInvoice = await prismadb.invoice.findFirst({
        orderBy: { createdAt: "desc" },
        where: { deletedAt: null },
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
});

export async function sendInvoiceAction(data: z.infer<typeof monthlyInvoiceSchema>) {
  return await safeServerAction({
    data,
    schema: monthlyInvoiceSchema,
    roles: ["admin"],
    serverAction: async ({ invoiceId }) => {
      // await addDelay(2000);
      return await sendInvoice(invoiceId);
    },
  });
}
