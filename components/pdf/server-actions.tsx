"use server";
import { getSessionUser } from "@/actions/get-user";
import prismadb from "@/lib/prismadb";
import type { FullOrder } from "@/types";
import { pdf } from "@react-pdf/renderer";
import * as z from "zod";
import Invoice from "./create-invoice";
import MonthlyInvoice from "./create-monthly-invoice";
import ShippingOrder from "./create-shipping";
import {
  createMonthlyPDFData,
  createPDFData,
  getMonthlyDate,
} from "./pdf-data";

const pdf64StringSchema = z.object({
  orderId: z.string(),
  type: z.union([z.literal("invoice"), z.literal("shipping")]),
});
export async function createPDF64String(
  data: z.infer<typeof pdf64StringSchema>,
): Promise<string> {
  const user = await getSessionUser();

  if (!user) {
    throw new Error(`Vous devez etre connecté`);
  }

  const isValide = pdf64StringSchema.safeParse(data);
  if (!isValide.success) {
    throw new Error(`La requête n'est pas valide`);
  }
  const order = await prismadb.order.findUnique({
    where: {
      id: data.orderId,
    },
    include: {
      orderItems: true,
      shop: true,
      customer: true,
    },
  });
  if (!order) {
    throw new Error(`La commande n'existe pas`);
  }
  if (user.role !== "admin" && user.id !== order.userId) {
    throw new Error(`Vous ne pouvez pas voir cette commande`);
  }

  const blob = await generatePdf({ data: order, type: data.type });
  const base64String = await blobToBase64(blob);
  return base64String;
}

const monthlyPdf64StringSchema = z.array(z.string());

export async function createMonthlyPDF64String(
  data: z.infer<typeof monthlyPdf64StringSchema>,
): Promise<{ base64String: string; date: string }> {
  const user = await getSessionUser();

  if (!user) {
    throw new Error(`Vous devez etre connecté`);
  }

  const isValide = monthlyPdf64StringSchema.safeParse(data);
  if (!isValide.success) {
    throw new Error(`La requête n'est pas valide`);
  }
  const orders = await prismadb.order.findMany({
    where: {
      id: { in: data },
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
    throw new Error(`Aucune commande pour ce mois`);
  }

  if (user.role !== "admin") {
    const userOrder = orders.every((order) => order.userId === user.id);
    if (!userOrder) {
      throw new Error(`Aucune commande pour ce mois`);
    }
  }

  if (!orders[0].dateOfShipping) {
    throw new Error(`Aucune commande pour ce mois`);
  }

  const date = getMonthlyDate(orders[0].dateOfShipping);

  const blob = await generatePdf({ data: orders, type: "monthly" });
  const base64String = await blobToBase64(blob);
  return { base64String, date };
}

async function generatePdf({
  data,
  type,
}:
  | {
      data: FullOrder;
      type: "invoice" | "shipping";
    }
  | { data: FullOrder[]; type: "monthly" }): Promise<Blob> {
  let doc: JSX.Element;
  switch (type) {
    case "invoice":
      doc = (
        <Invoice
          dataInvoice={createPDFData(data)}
          isPaid={!!data.dateOfPayment}
        />
      );
      break;
    case "shipping":
      doc = <ShippingOrder pdfData={createPDFData(data)} />;
      break;
    case "monthly":
    {  const isPaid = data.every((order) => !!order.dateOfPayment);
      doc = (
        <MonthlyInvoice data={createMonthlyPDFData(data)} isPaid={isPaid} />
      );
      break;}
  }

  const pdfBlob = await pdf(doc).toBlob();
  return pdfBlob;
}

async function blobToBase64(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString("base64");
}
