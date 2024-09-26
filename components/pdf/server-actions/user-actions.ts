"use server";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";
import { createInvoicePDF64String, createShippingPDF64String } from "./create-pdf64-string";

const pdf64StringSchema = z.object({
  pdfId: z.string(),
});
export async function createShippingPDF64StringAction(data: z.infer<typeof pdf64StringSchema>) {
  return await safeServerAction({
    data,
    schema: pdf64StringSchema,
    serverAction: async ({ pdfId }, { id, role }) => {
      const result = await createShippingPDF64String(pdfId);
      if (!result.success) {
        return { success: false, message: result.message };
      }
      if (!result.data || result.data.userId !== id || !result.data.delivered || role !== "pro") {
        return { success: false, message: "Erreur" };
      }

      return { success: true, message: "", data: result.data.base64String };
    },
  });
}

export async function createInvoicePDF64StringAction(data: z.infer<typeof pdf64StringSchema>) {
  return await safeServerAction({
    data,
    schema: pdf64StringSchema,
    serverAction: async ({ pdfId }, { id }) => {
      const result = await createInvoicePDF64String(pdfId);
      if (!result.success) {
        return { success: false, message: result.message };
      }
      if (!result.data || result.data.userId !== id) {
        return { success: false, message: "Erreur" };
      }

      return { success: true, message: "", data: result.data };
    },
  });
}
