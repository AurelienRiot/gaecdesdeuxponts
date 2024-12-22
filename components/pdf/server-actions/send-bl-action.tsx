"use server";
import { updateStocks } from "@/actions/update-stocks";
import { SHIPPING } from "@/components/auth";
import SendBLEmail from "@/components/email/send-bl";
import { dateFormatter, getLocalIsoString } from "@/lib/date-utils";
import { transporter } from "@/lib/nodemailer";
import prismadb from "@/lib/prismadb";
import { revalidateOrders } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import { addDelay } from "@/lib/utils";
import { render } from "@react-email/render";
import { renderToBuffer } from "@react-pdf/renderer";
import { z } from "zod";
import ShippingOrder from "../create-shipping";
import { createPDFData } from "../pdf-data";

const baseUrl = process.env.NEXT_PUBLIC_URL;

const BLSchema = z.object({
  orderId: z.string(),
});

export async function SendBL(data: z.infer<typeof BLSchema>) {
  return await safeServerAction({
    data,
    schema: BLSchema,
    roles: SHIPPING,
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
      if (order.user.role === "trackOnlyUser") {
        return {
          success: false,
          message: "Pas d'envoie de bon de livraison pour utilisateur en suivie seulement",
        };
      }
      const today = new Date();

      if (
        !order.dateOfEdition ||
        new Date(getLocalIsoString(order.dateOfEdition)) < new Date(getLocalIsoString(order.dateOfShipping))
      ) {
        await prismadb.order.update({
          where: {
            id: order.id,
          },
          data: {
            dateOfEdition: today,
          },
        });
        order.dateOfEdition = today;
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
        } else {
          await addDelay(3000);
          // return {
          //   success: false,
          //   message: "Environnement de test",
          // };
        }
      }
      !order.shippingEmail && (await updateStocks(order.orderItems));

      await prismadb.order.update({
        where: {
          id: order.id,
        },
        data: {
          shippingEmail: today,
        },
      });

      // createOrdersEvent({ date: order.dateOfShipping });
      revalidateOrders();

      return {
        success: true,
        message: "",
      };
    },
  });
}
