"use server";
import { checkAdmin } from "@/components/auth/checkAuth";
import createOrdersEvent from "@/components/google-events/create-orders-event";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const deleteSchema = z.object({
  id: z.string().optional(),
  dateOfShipping: z.date().optional().nullable(),
});

async function deleteOrder(data: z.infer<typeof deleteSchema>) {
  return await safeServerAction({
    data,
    schema: deleteSchema,
    getUser: checkAdmin,
    serverAction: async (data) => {
      const { id } = data;
      await prismadb.order
        .delete({
          where: { id },
        })
        .catch((e) => {
          console.log(e);
          return {
            success: false,
            message: "Une erreur est survenue",
          };
        });

      if (data.dateOfShipping) {
        revalidateTag("orders");

        const event = await createOrdersEvent({ date: data.dateOfShipping });
        if (!event.success) {
          console.log(event.message);
        }
      }

      return {
        success: true,
        message: "Commande supprimé",
      };
    },
  });
}
export { deleteOrder };
