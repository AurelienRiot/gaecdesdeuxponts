"use server";
import { checkAdmin } from "@/components/auth/checkAuth";
import SendMonthlyInvoiceEmail from "@/components/email/send-monthly-invoice";
import { dateMonthYear } from "@/lib/date-utils";
import { transporter } from "@/lib/nodemailer";
import prismadb from "@/lib/prismadb";
import safeServerAction, { type ReturnTypeServerAction } from "@/lib/server-action";
import { render } from "@react-email/render";
import { renderToBuffer } from "@react-pdf/renderer";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import MonthlyInvoice from "../create-monthly-invoice";
import { createMonthlyPDFData } from "../pdf-data";
import { addDelay } from "@/lib/utils";

const baseUrl = process.env.NEXT_PUBLIC_URL;

const monthlyInvoiceSchema = z.object({
  orderIds: z.array(z.string()),
});

export async function sendMonthlyInvoice(data: z.infer<typeof monthlyInvoiceSchema>) {
  return await safeServerAction({
    data,
    schema: monthlyInvoiceSchema,
    getUser: checkAdmin,
    serverAction: async ({ orderIds }) => {
      // await addDelay(2000);
      return getAndSendMonthlyInvoice(orderIds);
    },
  });
}

const groupedMonthlyInvoiceSchema = z.array(z.array(z.string()));

export async function sendGroupedMonthlyInvoice(data: z.infer<typeof groupedMonthlyInvoiceSchema>) {
  return await safeServerAction({
    data,
    schema: groupedMonthlyInvoiceSchema,
    getUser: checkAdmin,
    serverAction: async (orderArray) => {
      // await addDelay(2000);
      const monthlyInvoice = await Promise.all(
        orderArray.map(
          async (orderIds) =>
            // await addDelay(2000).then(() => ({ success: true }))),
            await getAndSendMonthlyInvoice(orderIds),
        ),
      );
      return monthlyInvoice.every((invoice) => invoice.success)
        ? { success: true, message: "Toutes les factures sont envoyées" }
        : { success: false, message: "Une erreur est survenue lors de l'envoi des factures" };
    },
  });
}

async function getAndSendMonthlyInvoice(orderIds: string[]): Promise<ReturnTypeServerAction> {
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

  if (!orders[0].customer) {
    return {
      success: false,
      message: "Le client n'existe pas, revalider la commande",
    };
  }

  const date = dateMonthYear(orders.map((order) => order.dateOfShipping));

  const pdfBuffer = await renderToBuffer(<MonthlyInvoice data={createMonthlyPDFData(orders)} isPaid={false} />);

  // try {
  //   await transporter.sendMail({
  //     from: "laiteriedupontrobert@gmail.com",
  //     to: orders[0].customer.email,
  //     subject: `Facture Mensuelle ${date}  - Laiterie du Pont Robert`,
  //     html: await render(
  //       SendMonthlyInvoiceEmail({
  //         date,
  //         baseUrl,
  //         email: orders[0].customer.email,
  //       }),
  //     ),
  //     attachments: [
  //       {
  //         filename: `Facture mensuelle ${date}.pdf`,
  //         content: pdfBuffer,
  //         contentType: "application/pdf",
  //       },
  //     ],
  //   });
  // } catch (error) {
  //   return {
  //     success: false,
  //     message: "Erreur lors de l'envoi de la facture",
  //   };
  // }
  await addDelay(3000);

  await prismadb.order.updateMany({
    where: {
      id: { in: orderIds },
    },
    data: {
      invoiceEmail: new Date(),
    },
  });
  revalidateTag("orders");

  return {
    success: true,
    message: "Facture envoyée",
  };
}
