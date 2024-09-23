"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
});

async function deleteInvoice(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    schema,
    getUser: checkAdmin,
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
        message: "Facture supprimée",
      };
    },
  });
}

export default deleteInvoice;
