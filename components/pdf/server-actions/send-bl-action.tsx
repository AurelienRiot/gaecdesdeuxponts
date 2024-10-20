"use server";
import { SendBLEmail } from "@/components/email/send-bl";
import createOrdersEvent from "@/components/google-events/create-orders-event";
import { dateFormatter } from "@/lib/date-utils";
import { transporter } from "@/lib/nodemailer";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { render } from "@react-email/render";
import { renderToBuffer } from "@react-pdf/renderer";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import ShippingOrder from "../create-shipping";
import { createPDFData } from "../pdf-data";
import { updateStocks } from "@/actions/update-stocks";

const baseUrl = process.env.NEXT_PUBLIC_URL;

const BLSchema = z.object({
  orderId: z.string(),
});

export async function SendBL(data: z.infer<typeof BLSchema>) {
  return await safeServerAction({
    data,
    schema: BLSchema,
    roles: ["admin"],
    serverAction: async ({ orderId }) => {
      const order = await prismadb.order.findUnique({
        where: {
          id: orderId,
        },
        include: {
          orderItems: true,
          shop: true,
          user: { include: { notifications: true } },
          customer: true,
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

      if (!order.dateOfShipping) {
        return {
          success: false,
          message: "Veuillez entrer la date de livraison et revalider la commande",
        };
      }

      if (!order.user.email || order.user.email.includes("acompleter")) {
        return {
          success: false,
          message: "Le client n'a pas d'email, revalider la commande aprés avoir changé son email",
        };
      }

      if (!order.user.notifications || order.user.notifications.sendShippingEmail) {
        if (process.env.NODE_ENV === "production") {
          const pdfBuffer = await renderToBuffer(<ShippingOrder pdfData={createPDFData(order)} />);

          await transporter.sendMail({
            from: "laiteriedupontrobert@gmail.com",
            to: order.user.email,
            subject: "Bon de livraison - Laiterie du Pont Robert",
            text: await render(
              SendBLEmail({
                date: dateFormatter(order.dateOfShipping),
                baseUrl,
                id: order.id,
                email: order.user.email,
              }),
              { plainText: true },
            ),
            html: await render(
              SendBLEmail({
                date: dateFormatter(order.dateOfShipping),
                baseUrl,
                id: order.id,
                email: order.user.email,
              }),
            ),
            attachments: [
              {
                filename: `Bon de livraison ${order.id}.pdf`,
                content: pdfBuffer,
                contentType: "application/pdf",
              },
            ],
          });
        }
      }
      !order.shippingEmail && (await updateStocks(order.orderItems));

      await prismadb.order.update({
        where: {
          id: order.id,
        },
        data: {
          shippingEmail: new Date(),
        },
      });

      createOrdersEvent({ date: order.dateOfShipping });
      revalidateTag("orders");

      return {
        success: true,
        message: "BL envoyé",
      };
    },
  });
}
