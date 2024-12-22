"use server";

import { SHIPPING } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import { revalidateInvoices, revalidateOrders, revalidateUsers } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import { PaymentMethod } from "@prisma/client";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
  isPaid: z.boolean(),
  paymentMethod: z.nativeEnum(PaymentMethod).nullable(),
});

async function validateInvoice(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    schema,
    roles: SHIPPING,
    serverAction: async ({ id, isPaid, paymentMethod }) => {
      const invoice = await prismadb.invoice.update({
        where: {
          id,
        },
        data: {
          dateOfPayment: isPaid ? new Date() : null,
          paymentMethod,
          // dateOfEdition: new Date(),
        },
        select: {
          id: true,
          userId: true,
        },
      });

      if (!invoice) {
        return {
          success: false,
          message: "Une erreur est survenue",
        };
      }
      revalidateInvoices();
      revalidateOrders();
      revalidateUsers(invoice.userId);

      return {
        success: true,
        message: isPaid ? "La facture est validée" : "La facture est annulée",
      };
    },
  });
}

export default validateInvoice;
