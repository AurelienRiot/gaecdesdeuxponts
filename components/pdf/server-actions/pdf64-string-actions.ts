"use server";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";
import { generatePdfSring64 } from "../pdf-fuction";
import { createInvoicePDF64String, createShippingPDF64String } from "./create-pdf64-string";

const pdf64StringSchema = z.object({
  orderId: z.string(),
});
export async function createShippingPDF64StringAction(data: z.infer<typeof pdf64StringSchema>) {
  return await safeServerAction({
    data,
    schema: pdf64StringSchema,
    roles: ["admin", "readOnlyAdmin"],
    serverAction: async ({ orderId }) => {
      return await createShippingPDF64String(orderId);
    },
  });
}

const amapPdf64StringSchema = z.object({
  orderId: z.string(),
});
export async function createAMAPPDF64StringAction(data: z.infer<typeof amapPdf64StringSchema>) {
  return await safeServerAction({
    data,
    schema: amapPdf64StringSchema,
    roles: ["admin", "readOnlyAdmin"],
    serverAction: async ({ orderId }) => {
      const order = await prismadb.aMAPOrder.findUnique({
        where: {
          id: orderId,
        },
        include: {
          amapItems: true,
          user: { include: { address: true, billingAddress: true } },
        },
      });
      if (!order) {
        return {
          success: false,
          message: "La commande n'existe pas",
        };
      }

      const base64String = await generatePdfSring64({ data: order, type: "amap" });
      return {
        success: true,
        message: "",
        data: base64String,
      };
    },
  });
}

const invoicePDF64StringSchema = z.object({
  invoiceId: z.string(),
});

export async function createInvoicePDF64StringAction(data: z.infer<typeof invoicePDF64StringSchema>) {
  return await safeServerAction({
    data,
    schema: invoicePDF64StringSchema,
    roles: ["admin", "readOnlyAdmin"],
    serverAction: async ({ invoiceId }) => {
      return await createInvoicePDF64String(invoiceId);
    },
  });
}
