"use server";
import { checkReadOnlyAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";
import { generatePdfSring64 } from "./pdf-fuction";
import { dateMonthYear } from "@/lib/date-utils";

const pdf64StringSchema = z.object({
  orderId: z.string(),
  type: z.union([z.literal("invoice"), z.literal("shipping")]),
});
export async function createPDF64String(data: z.infer<typeof pdf64StringSchema>) {
  return await safeServerAction({
    data,
    schema: pdf64StringSchema,
    getUser: checkReadOnlyAdmin,
    serverAction: async ({ orderId, type }) => {
      const order = await prismadb.order.findUnique({
        where: {
          id: orderId,
        },
        include: {
          orderItems: true,
          shop: true,
          customer: true,
        },
      });
      if (!order) {
        return {
          success: false,
          message: "La commande n'existe pas",
        };
      }

      const base64String = await generatePdfSring64({ data: order, type: type });
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
export async function createAMAPPDF64String(data: z.infer<typeof amapPdf64StringSchema>) {
  return await safeServerAction({
    data,
    schema: amapPdf64StringSchema,
    getUser: checkReadOnlyAdmin,
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

const monthlyPdf64StringSchema = z.object({
  orderIds: z.array(z.string()),
});

export async function createMonthlyPDF64String(data: z.infer<typeof monthlyPdf64StringSchema>) {
  return await safeServerAction({
    data,
    schema: monthlyPdf64StringSchema,
    getUser: checkReadOnlyAdmin,
    serverAction: async ({ orderIds }) => {
      const orders = await prismadb.order.findMany({
        where: {
          id: { in: orderIds },
          dateOfShipping: { not: null },
        },
        include: {
          orderItems: true,
          shop: true,
          customer: true,
        },
        orderBy: {
          dateOfShipping: "asc",
        },
      });
      if (orders.length === 0) {
        return {
          success: false,
          message: "Aucune commande pour ce mois",
        };
      }
      if (!orders[0].dateOfShipping) {
        return {
          success: false,
          message: "Aucune commande pour ce mois",
        };
      }

      const date = dateMonthYear(orders.map((order) => order.dateOfShipping));

      const base64String = await generatePdfSring64({ data: orders, type: "monthly" });
      return {
        success: true,
        message: "",
        data: { base64String, date },
      };
    },
  });
}
