import SendMonthlyInvoiceEmail from "@/components/email/send-monthly-invoice";
import { dateMonthYear } from "@/lib/date-utils";
import { transporter } from "@/lib/nodemailer";
import prismadb from "@/lib/prismadb";
import type { ReturnTypeServerAction } from "@/lib/server-action";
import { render } from "@react-email/render";
import { renderToBuffer } from "@react-pdf/renderer";
import { revalidateTag } from "next/cache";
import MonthlyInvoice from "../create-monthly-invoice";
import { createMonthlyPDFData } from "../pdf-data";
import { getUserName } from "@/components/table-custom-fuction";

const baseUrl = process.env.NEXT_PUBLIC_URL;
export async function getAndSendMonthlyInvoice(orderIds: string[]): Promise<ReturnTypeServerAction> {
  // await addDelay(3000);
  // return { success: true, message: `Facture envoyée ${orderIds[0]}` };
  const orders = await prismadb.order.findMany({
    where: {
      id: { in: orderIds },
      dateOfShipping: { not: null },
      deletedAt: null,
    },
    include: {
      orderItems: true,
      shop: true,
      customer: true,
      user: { select: { name: true, company: true, email: true } },
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
  const name = getUserName(orders[0].user);

  const date = dateMonthYear(orders.map((order) => order.dateOfShipping));

  const pdfBuffer = await renderToBuffer(<MonthlyInvoice data={createMonthlyPDFData(orders)} isPaid={false} />);

  if (!orders[0].customer || orders[0].customer.email.includes("acompleter")) {
    return {
      success: false,
      message: "Le client n'a pas d'email, revalider la commande aprés avoir changé son email",
    };
  }

  try {
    await transporter.sendMail({
      from: "laiteriedupontrobert@gmail.com",
      to: orders[0].customer.email,
      // to: "pub.demystify390@passmail.net",
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

    await prismadb.order.updateMany({
      where: {
        id: { in: orders.map((order) => order.id) },
      },
      data: {
        invoiceEmail: new Date(),
      },
    });
    revalidateTag("orders");
  } catch (error) {
    return {
      success: false,
      message: `Erreur lors de l'envoi de la facture de ${name}`,
    };
  }

  return {
    success: true,
    message: `Facture envoyée pour ${name}`,
  };
}
