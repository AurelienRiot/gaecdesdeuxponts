import { dateMonthYear } from "@/lib/date-utils";
import prismadb from "@/lib/prismadb";
import type { ReturnTypeServerAction } from "@/lib/server-action";
import { addDelay } from "@/lib/utils";
import { renderToBuffer } from "@react-pdf/renderer";
import { revalidateTag } from "next/cache";
import MonthlyInvoice from "../create-monthly-invoice";
import { createMonthlyPDFData } from "../pdf-data";
import { transporter } from "@/lib/nodemailer";
import { render } from "@react-email/render";
import SendMonthlyInvoiceEmail from "@/components/email/send-monthly-invoice";

const baseUrl = process.env.NEXT_PUBLIC_URL;
export async function getAndSendMonthlyInvoice(orderIds: string[]): Promise<ReturnTypeServerAction> {
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

  try {
    await transporter.sendMail({
      from: "laiteriedupontrobert@gmail.com",
      // to: orders[0].customer.email,
      to: "pub.demystify390@passmail.net",
      subject: `Facture Mensuelle ${date}  - Laiterie du Pont Robert`,
      html: await render(
        SendMonthlyInvoiceEmail({
          date,
          baseUrl,
          email: orders[0].customer.email,
        }),
      ),
      attachments: [
        {
          filename: `Facture mensuelle ${date}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });
  } catch (error) {
    return {
      success: false,
      message: "Erreur lors de l'envoi de la facture",
    };
  }
  await addDelay(3000);

  // await prismadb.order.updateMany({
  //   where: {
  //     id: { in: orderIds },
  //   },
  //   data: {
  //     invoiceEmail: new Date(),
  //   },
  // });
  revalidateTag("orders");

  return {
    success: true,
    message: "Facture envoyée",
  };
}
