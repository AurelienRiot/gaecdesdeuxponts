"use server";
import { getSessionUser } from "@/actions/get-user";
import OrderEmail from "@/components/email/order";
import OrderSendEmail from "@/components/email/order-send";
import Order from "@/components/pdf/create-commande";
import { createPDFData } from "@/components/pdf/pdf-data";
import { dateFormatter } from "@/lib/date-utils";
import { transporter } from "@/lib/nodemailer";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { currencyFormatter } from "@/lib/utils";
import type { FullOrder } from "@/types";
import { render } from "@react-email/render";
import { pdf } from "@react-pdf/renderer";
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
    getUser: getSessionUser,
    serverAction: async (data, user) => {
      const order = await prismadb.order.findUnique({
        where: {
          id: data.orderId,
          userId: user.id,
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
          message: "Commande introuvable",
        };
      }

      if (order.orderEmail) {
        return {
          success: true,
          message: "",
        };
      }

      console.time("Generate PDF");
      const pdfBuffer = await generatePdf(order);
      console.timeEnd("Generate PDF");

      console.time("Generate email");
      try {
        // Send emails in parallel
        const emailPromises = [
          transporter.sendMail({
            from: "laiteriedupontrobert@gmail.com",
            to: user.email || "",
            subject: "Confirmation de votre commande - Laiterie du Pont Robert",
            html: render(
              OrderEmail({
                date: dateFormatter(order.createdAt),
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
              html: render(
                OrderSendEmail({
                  baseUrl,
                  id: order.id,
                  name: user.name || user.email || "Utilisateur inconnu",
                  price: currencyFormatter.format(order.totalPrice),
                  date: dateFormatter(order.createdAt),
                }),
              ),
            }),
          );
        }
        console.timeEnd("Generate email");
        console.time("Send Emails");
        await Promise.all(emailPromises);

        console.timeEnd("Send Emails");
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

      return {
        success: true,
        message: "Bon de commande envoyé par email",
      };
    },
  });
}

async function generatePdf(order: FullOrder) {
  const pdfData = createPDFData(order);
  const doc = Order({ data: pdfData });
  const pdfBlob = await pdf(doc).toBlob();
  const arrayBuffer = await pdfBlob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer;
}

export default sendCheckoutEmail;
