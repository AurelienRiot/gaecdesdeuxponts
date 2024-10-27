"use server";
import SendAMAPEmail from "@/components/email/send-amap";
import { dateFormatter } from "@/lib/date-utils";
import { transporter } from "@/lib/nodemailer";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { render } from "@react-email/render";
import { renderToBuffer } from "@react-pdf/renderer";
import { z } from "zod";
import AmapPDF from "../create-amap";
import { createAMAPData } from "../pdf-data";
import { ADMIN } from "@/components/auth";

const baseUrl = process.env.NEXT_PUBLIC_URL;

const AMAPSchema = z.object({
  orderId: z.string(),
});

export async function SendAMAP(data: z.infer<typeof AMAPSchema>) {
  return await safeServerAction({
    data,
    schema: AMAPSchema,
    roles: ADMIN,
    serverAction: async ({ orderId }) => {
      const order = await prismadb.aMAPOrder.findUnique({
        where: {
          id: orderId,
        },
        include: {
          amapItems: true,
          shop: true,
          user: { include: { address: true, billingAddress: true } },
        },
      });
      if (!order) {
        return {
          success: false,
          message: "La contrat n'existe pas",
        };
      }

      const pdfData = createAMAPData(order, order.user);

      const pdfBuffer = await renderToBuffer(<AmapPDF data={pdfData} />);

      await transporter.sendMail({
        from: "laiteriedupontrobert@gmail.com",
        to: pdfData.customer.email,
        subject: "Bon de livraison - Laiterie du Pont Robert",
        text: await render(
          SendAMAPEmail({
            startDate: dateFormatter(order.startDate),
            endDate: dateFormatter(order.endDate),
            baseUrl,
            id: order.id,
            email: pdfData.customer.email,
          }),
          { plainText: true },
        ),
        html: await render(
          SendAMAPEmail({
            startDate: dateFormatter(order.startDate),
            endDate: dateFormatter(order.endDate),
            baseUrl,
            id: order.id,
            email: pdfData.customer.email,
          }),
        ),
        attachments: [
          {
            filename: `Contrat AMAP ${order.id}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      });

      return {
        success: true,
        message: "contrat envoyé",
      };
    },
  });
}
