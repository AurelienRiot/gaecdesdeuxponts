"use server";
import { dateMonthYear } from "@/lib/date-utils";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";
import { generatePdfSring64 } from "../pdf-fuction";

const pdf64StringSchema = z.object({
  orderId: z.string(),
});
async function createPDF64String(data: z.infer<typeof pdf64StringSchema>) {
  return await safeServerAction({
    data,
    schema: pdf64StringSchema,
    roles: ["admin", "readOnlyAdmin"],
    serverAction: async ({ orderId }) => {
      const order = await prismadb.order.findUnique({
        where: {
          id: orderId,
          deletedAt: null,
        },
        include: {
          orderItems: true,
          shop: true,
          user: { include: { address: true, billingAddress: true } },
          invoiceOrder: {
            select: { invoice: { select: { id: true, invoiceEmail: true, dateOfPayment: true } } },
            orderBy: { createdAt: "desc" },
            where: { invoice: { deletedAt: null } },
          },
        },
      });
      if (!order) {
        return {
          success: false,
          message: "La commande n'existe pas",
        };
      }

      const base64String = await generatePdfSring64({ data: order, type: "shipping" });
      return {
        success: true,
        message: "",
        data: base64String,
      };
    },
  });
}

const amapPdf64StringSchema = z.object({
  orderId: z.string(),
});
async function createAMAPPDF64String(data: z.infer<typeof amapPdf64StringSchema>) {
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

async function createInvoicePDF64String(data: z.infer<typeof invoicePDF64StringSchema>) {
  return await safeServerAction({
    data,
    schema: invoicePDF64StringSchema,
    roles: ["admin", "readOnlyAdmin"],
    serverAction: async ({ invoiceId }) => {
      const fullInvoice = await prismadb.invoice.findUnique({
        where: {
          id: invoiceId,
          deletedAt: null,
        },
        include: {
          customer: true,
          orders: {
            include: { invoiceOrderItems: true },
          },
        },
      });
      if (!fullInvoice) {
        return {
          success: false,
          message: "La facture n'existe pas",
        };
      }
      const type = fullInvoice.orders.length === 1 ? "single" : "monthly";
      const date = dateMonthYear(fullInvoice.orders.map((order) => order.dateOfShipping));

      const base64String = await generatePdfSring64({ data: fullInvoice, type });
      return {
        success: true,
        message: "",
        data: { base64String, date, type },
      };
    },
  });
}

export { createAMAPPDF64String, createInvoicePDF64String, createPDF64String };
