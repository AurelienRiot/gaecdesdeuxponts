"use server";
import { SHIPPING_ONLY } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import { revalidateOrders } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";

const deleteSchema = z.object({
  id: z.string().optional(),
  dateOfShipping: z.date().optional().nullable(),
});

async function deleteOrder(data: z.infer<typeof deleteSchema>) {
  return await safeServerAction({
    data,
    schema: deleteSchema,
    roles: SHIPPING_ONLY,
    serverAction: async ({ id }) => {
      await prismadb.order
        .update({
          where: { id },
          data: {
            deletedAt: new Date(),
          },
        })
        .catch((e) => {
          console.log(e);
          return {
            success: false,
            message: "Une erreur est survenue",
          };
        });

      // if (data.dateOfShipping) {
      //   await createOrdersEvent(data.dateOfShipping);
      // }
      revalidateOrders();

      return {
        success: true,
        message: "Commande supprimé",
      };
    },
  });
}
export { deleteOrder };
