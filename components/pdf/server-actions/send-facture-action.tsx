"use server";
import { checkAdmin } from "@/components/auth/checkAuth";
import SendFactureEmail from "@/components/email/send-facture";
import { dateFormatter } from "@/lib/date-utils";
import { transporter } from "@/lib/nodemailer";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { currencyFormatter } from "@/lib/utils";
import { render } from "@react-email/render";
import { renderToBuffer } from "@react-pdf/renderer";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import Invoice from "../create-invoice";
import { createPDFData } from "../pdf-data";

const baseUrl = process.env.NEXT_PUBLIC_URL;

const factureSchema = z.object({
  orderId: z.string(),
});

export async function sendFacture(data: z.infer<typeof factureSchema>) {
  return await safeServerAction({
    data,
    schema: factureSchema,
    getUser: checkAdmin,
    serverAction: async (data) => {
      const { orderId } = data;
      const order = await prismadb.order.findUnique({
        where: {
          id: orderId,
        },
        include: {
          orderItems: true,
          shop: true,
          user: { include: { address: true, billingAddress: true } },
          invoiceOrder: {
            select: { invoice: { select: { invoiceEmail: true, dateOfPayment: true } } },
            orderBy: { createdAt: "desc" },
          },
        },
      });
      if (!order) {
        return {
          success: false,
          message: "La commande n'existe pas",
        };
      }

      if (!order.dateOfShipping) {
        return {
          success: false,
          message: "Veuillez valider la date de livraison et revalider la commande",
        };
      }

      if (!order.user.email || order.user.email.includes("acompleter")) {
        return {
          success: false,
          message: "Le client n'a pas d'email, revalider la commande aprés avoir changé son email",
        };
      }

      const pdfBuffer = await renderToBuffer(
        <Invoice dataInvoice={createPDFData(order)} isPaid={!!order.invoiceOrder[0]?.invoice.dateOfPayment} />,
      );

      await transporter.sendMail({
        from: "laiteriedupontrobert@gmail.com",
        to: order.user.email,
        subject: "Facture - Laiterie du Pont Robert",
        html: await render(
          SendFactureEmail({
            date: dateFormatter(order.dateOfShipping),
            baseUrl,
            id: order.id,
            price: currencyFormatter.format(order.totalPrice),
            email: order.user.email,
          }),
        ),
        attachments: [
          {
            filename: `Facture ${order.id}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      });

      // await prismadb.order.update({
      //   where: {
      //     id: order.id,
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
    },
  });
}
