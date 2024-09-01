"use server";
import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { renderToBuffer } from "@react-pdf/renderer";
import { z } from "zod";
import ShippingOrder from "../create-shipping";
import { createPDFData } from "../pdf-data";
import { transporter } from "@/lib/nodemailer";
import { render } from "@react-email/render";
import SendBLEmail from "@/components/email/send-bl";
import { dateFormatter } from "@/lib/date-utils";
import { revalidateTag } from "next/cache";

const baseUrl = process.env.NEXT_PUBLIC_URL;

const BLSchema = z.object({
  orderId: z.string(),
});

export async function SendBL(data: z.infer<typeof BLSchema>) {
  return await safeServerAction({
    data,
    schema: BLSchema,
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
          customer: true,
        },
      });
      if (!order) {
        return {
          success: false,
          message: "La commande n'existe pas",
        };
      }

      if (!order.customer) {
        return {
          success: false,
          message: "Le client n'existe pas, revalider la commande",
        };
      }

      if (!order.dateOfShipping) {
        return {
          success: false,
          message: "Veuillez entrer la date de livraison et revalider la commande",
        };
      }

      const pdfBuffer = await renderToBuffer(<ShippingOrder pdfData={createPDFData(order)} />);

      await transporter.sendMail({
        from: "laiteriedupontrobert@gmail.com",
        to: order.customer.email,
        subject: "Bon de livraison - Laiterie du Pont Robert",
        html: await render(
          SendBLEmail({
            date: dateFormatter(order.dateOfShipping),
            baseUrl,
            id: order.id,
            email: order.customer.email,
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
      await prismadb.order.update({
        where: {
          id: order.id,
        },
        data: {
          shippingEmail: new Date(),
        },
      });
      revalidateTag("orders");

      return {
        success: true,
        message: "BL envoyé",
      };
    },
  });
}
