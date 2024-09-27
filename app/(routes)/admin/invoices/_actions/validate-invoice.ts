"use server";

import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
  isPaid: z.boolean(),
});

async function validateInvoice(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    schema,
    roles: ["admin"],
    serverAction: async ({ id, isPaid }) => {
      const invoice = await prismadb.invoice.update({
        where: {
          id,
        },
        data: {
          dateOfPayment: isPaid ? new Date() : null,
          // dateOfEdition: new Date(),
        },
        select: {
          id: true,
        },
      });

      if (!invoice) {
        return {
          success: false,
          message: "Une erreur est survenue",
        };
      }

      return {
        success: true,
        message: isPaid ? "La facture est validée" : "La facture est annulée",
      };
    },
  });
}

export default validateInvoice;
