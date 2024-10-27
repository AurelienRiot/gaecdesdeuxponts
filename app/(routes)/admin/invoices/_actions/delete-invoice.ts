"use server";

import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
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
        },
      });

      if (!invoice) {
        return {
          success: false,
          message: "Une erreur est survenue",
        };
      }
      revalidateTag("invoices");
      revalidateTag("orders");
      revalidateTag("users");

      return {
        success: true,
        message: "Facture supprimée",
      };
    },
  });
}

export default deleteInvoice;
