import SendFactureEmail from "@/components/email/send-facture";
import SendMonthlyInvoiceEmail from "@/components/email/send-monthly-invoice";
import { getUserName } from "@/components/table-custom-fuction";
import { dateFormatter, dateMonthYear } from "@/lib/date-utils";
import { transporter } from "@/lib/nodemailer";
import prismadb from "@/lib/prismadb";
import type { ReturnTypeServerAction } from "@/lib/server-action";
import { addressFormatter, currencyFormatter, formatFrenchPhoneNumber } from "@/lib/utils";
import { render } from "@react-email/render";
import { renderToBuffer } from "@react-pdf/renderer";
import { revalidateTag } from "next/cache";
import Invoice from "../create-invoice";
import MonthlyInvoice from "../create-monthly-invoice";
import { createInvoicePDFData, createMonthlyInvoicePDFData } from "../pdf-data";

const baseUrl = process.env.NEXT_PUBLIC_URL;
export async function sendInvoice(invoiceId: string) {
  const fullInvoice = await prismadb.invoice.findUnique({
    where: {
      id: invoiceId,
      deletedAt: null,
    },
    include: {
      customer: true,
      user: { include: { notifications: true } },
      orders: { include: { invoiceOrderItems: true }, orderBy: { dateOfShipping: "asc" } },
    },
  });
  if (!fullInvoice) {
    return {
      success: false,
      message: "Aucune commande pour ce mois",
    };
  }

  if (!fullInvoice.customer) {
    return {
      success: false,
      message: "Le client n'existe pas",
    };
  }

  if (!fullInvoice.customer.email || fullInvoice.customer.email.includes("acompleter") || !fullInvoice.user.completed) {
    return {
      success: false,
      message: "Le client n'a pas d'email, revalider la commande aprés avoir changé son email",
      errorData: { incomplete: true, userId: fullInvoice.user.id },
    };
  }

  const name = getUserName(fullInvoice.customer);

  const date = dateMonthYear(fullInvoice.orders.map((order) => order.dateOfShipping));
  const type = fullInvoice.orders.length === 1 ? "single" : "monthly";

  try {
    if (!fullInvoice.user.notifications || fullInvoice.user.notifications.sendInvoiceEmail) {
      // if (process.env.NODE_ENV === "production") {
      const pdfBuffer =
        type === "monthly"
          ? await renderToBuffer(
              <MonthlyInvoice data={createMonthlyInvoicePDFData(fullInvoice)} isPaid={!!fullInvoice.dateOfPayment} />,
            )
          : await renderToBuffer(
              <Invoice dataInvoice={createInvoicePDFData(fullInvoice)} isPaid={!!fullInvoice.dateOfPayment} />,
            );
      const text =
        type === "monthly"
          ? await render(
              SendMonthlyInvoiceEmail({
                date,
                baseUrl,
                email: fullInvoice.customer.email,
              }),
              { plainText: true },
            )
          : await render(
              SendFactureEmail({
                date: dateFormatter(fullInvoice.dateOfEdition),
                baseUrl,
                id: fullInvoice.id,
                price: currencyFormatter.format(fullInvoice.totalPrice),
                email: fullInvoice.customer.email,
              }),
              { plainText: true },
            );

      const html =
        type === "monthly"
          ? await render(
              SendMonthlyInvoiceEmail({
                date,
                baseUrl,
                email: fullInvoice.customer.email,
              }),
            )
          : await render(
              SendFactureEmail({
                date: dateFormatter(fullInvoice.dateOfEdition),
                baseUrl,
                id: fullInvoice.id,
                price: currencyFormatter.format(fullInvoice.totalPrice),
                email: fullInvoice.customer.email,
              }),
            );

      await transporter.sendMail({
        from: "laiteriedupontrobert@gmail.com",
        to: fullInvoice.customer.email,
        // to: "pub.demystify390@passmail.net",
        cc: fullInvoice.user.ccInvoice,
        subject:
          type === "monthly"
            ? `Facture Mensuelle ${date}  - Laiterie du Pont Robert`
            : `Facture du ${dateFormatter(fullInvoice.dateOfEdition)} - Laiterie du Pont Robert`,
        text,
        html,
        attachments: [
          {
            filename: type === "monthly" ? `Facture mensuelle ${date}.pdf` : `Facture ${fullInvoice.id}`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      });
      // }
    }

    await prismadb.invoice.update({
      where: {
        id: fullInvoice.id,
      },
      data: {
        invoiceEmail: new Date(),
      },
    });
  } catch (error) {
    return {
      success: false,
      message: `Erreur lors de l'envoi de la facture de ${name}`,
    };
  }

  revalidateTag("orders");
  revalidateTag("invoices");
  return {
    success: true,
    message: `Facture envoyée pour ${name}`,
  };
}

export async function createInvoice(
  orderIds: string[],
  previousID: string | null,
): Promise<ReturnTypeServerAction<{ invoiceId: string }>> {
  const orders = await prismadb.order.findMany({
    where: {
      id: {
        in: orderIds,
      },
    },
    include: {
      user: { include: { address: true, billingAddress: true } },
      orderItems: true,
      shop: true,
    },
  });
  if (orders.length !== orderIds.length) {
    return {
      success: false,
      message: "Toutes les commandes n'existent pas",
    };
  }
  const sameUser = orders.every((order) => order.user.id === orders[0].user.id);
  if (!sameUser) {
    return {
      success: false,
      message: "Toutes les commandes ne sont pas du meme client",
    };
  }

  const shippingAddress = orders[0].user.address ? addressFormatter(orders[0].user.address, true) : "";
  const billingAddress = orders[0].user.billingAddress
    ? addressFormatter(orders[0].user.billingAddress, true)
    : shippingAddress;

  const id = await createInvoiceId(previousID);
  const totalPrice = orders.reduce((acc, order) => acc + order.totalPrice, 0);
  const invoice = await prismadb.invoice.create({
    data: {
      id,
      dateOfEdition: new Date(),
      userId: orders[0].user.id,
      totalPrice,
      customer: {
        create: {
          name: orders[0].user.name || "",
          company: orders[0].user.company,
          email: orders[0].user.email || "",
          phone: formatFrenchPhoneNumber(orders[0].user.phone),
          shippingAddress,
          billingAddress,
          userId: orders[0].user.id,
        },
      },
      orders: {
        create: orders.map((order) => ({
          orderId: order.id,
          totalPrice: order.totalPrice,
          dateOfShipping: order.dateOfShipping,
          invoiceOrderItems: {
            create: order.orderItems.map((item) => ({
              itemId: item.itemId,
              name: item.name,
              price: item.price,
              tax: item.tax,
              unit: item.unit,
              quantity: item.quantity,
              categoryName: item.categoryName,
              description: item.description,
            })),
          },
        })),
      },
    },
    select: { id: true },
  });

  revalidateTag("orders");
  revalidateTag("invoices");
  return {
    success: true,
    message: `Facture crée pour ${orders[0].user.name}`,
    data: { invoiceId: invoice.id },
  };
}

export async function createInvoiceId(previousID: string | null) {
  const year = new Date().getFullYear();
  const newNumber = previousID ? Number(previousID.split("_")[2]) + 1 : 1;
  return `FA_${year}_${newNumber.toString().padStart(4, "0")}`;
}
