"use server";
import OrderEmail from "@/components/email/order";
import OrderSendEmail from "@/components/email/order-send";
import Order from "@/components/pdf/create-commande";
import { createPDFData } from "@/components/pdf/pdf-data";
import { dateFormatter } from "@/lib/date-utils";
import { transporter } from "@/lib/nodemailer";
import prismadb from "@/lib/prismadb";
import { revalidateOrders } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import { currencyFormatter } from "@/lib/utils";
import type { FullOrderWithInvoicePayment } from "@/types";
import { render } from "@react-email/render";
import { renderToBuffer } from "@react-pdf/renderer";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { z } from "zod";

const ExcludeEmail = ["yoyololo1235@gmail.com", "pub.demystify390@passmail.net"];

const baseUrl = process.env.NEXT_PUBLIC_URL;

const schema = z.object({
  orderId: z.string(),
});

async function sendCheckoutEmail(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    schema,
    serverAction: async (data, user) => {
      const order = await prismadb.order.findUnique({
        where: {
          id: data.orderId,
          userId: user.id,
          deletedAt: null,
        },
        include: {
          orderItems: true,
          shop: true,
          // user: { include: { address: true, billingAddress: true } },
          customer: true,
          invoiceOrder: {
            select: { invoice: { select: { id: true, invoiceEmail: true, dateOfPayment: true } } },
            where: { invoice: { deletedAt: null } },
          },
        },
      });

      if (!order) {
        return {
          success: false,
          message: "Commande introuvable",
        };
      }

      if (order.orderEmail) {
        return {
          success: true,
          message: "",
        };
      }

      const pdfBuffer = await generatePdf(order);

      try {
        const emailPromises = [
          transporter.sendMail({
            from: "laiteriedupontrobert@gmail.com",
            to: user.email || "",
            subject: "Confirmation de votre commande - Laiterie du Pont Robert",
            text: await render(
              OrderEmail({
                date: dateFormatter(order.createdAt),
                email: user.email || "",
                baseUrl,
                id: order.id,
                price: currencyFormatter.format(order.totalPrice),
              }),
              { plainText: true },
            ),
            html: await render(
              OrderEmail({
                date: dateFormatter(order.createdAt),
                email: user.email || "",
                baseUrl,
                id: order.id,
                price: currencyFormatter.format(order.totalPrice),
              }),
            ),
            attachments: [
              { filename: `Bon de commande ${order.id}.pdf`, content: pdfBuffer, contentType: "application/pdf" },
            ],
          }),
        ];

        if (process.env.NODE_ENV === "production" && user.email && !ExcludeEmail.includes(user.email)) {
          emailPromises.push(
            transporter.sendMail({
              from: "laiteriedupontrobert@gmail.com",
              to: "laiteriedupontrobert@gmail.com",
              subject: "[NOUVELLE COMMANDE] - Laiterie du Pont Robert",
              html: await render(
                OrderSendEmail({
                  baseUrl,
                  id: order.id,
                  name: user.name || user.email || "Utilisateur inconnu",
                  price: currencyFormatter.format(order.totalPrice),
                  date: format(order.datePickUp, "EEEE d MMMM yyyy, HH:mm", { locale: fr }),
                }),
              ),
            }),
          );
        }
        await Promise.all(emailPromises);
      } catch (error) {
        return {
          success: false,
          message: "Erreur lors de l'envoi de l'email",
        };
      }
      await prismadb.order.update({
        where: {
          id: order.id,
        },
        data: {
          orderEmail: new Date(),
        },
      });

      revalidateOrders();

      return {
        success: true,
        message: "Bon de commande envoyé par email",
      };
    },
  });
}

async function generatePdf(order: FullOrderWithInvoicePayment) {
  const pdfData = createPDFData(order);
  const pdfBuffer = await renderToBuffer(Order({ data: pdfData }));
  return pdfBuffer;
}

export default sendCheckoutEmail;
