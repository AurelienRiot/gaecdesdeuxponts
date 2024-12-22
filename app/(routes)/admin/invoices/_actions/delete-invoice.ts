"use server";

import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import { revalidateInvoices, revalidateOrders, revalidateUsers } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
});

async function deleteInvoice(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    schema,
    roles: ADMIN,
    serverAction: async ({ id }) => {
      const invoice = await prismadb.invoice.update({
        where: {
          id,
        },
        data: {
          deletedAt: new Date(),
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
        message: "Facture supprimée",
      };
    },
  });
}

export default deleteInvoice;
