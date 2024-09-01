"use server";
import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const deleteSchema = z.object({
  id: z.string().optional(),
  shippingDays: z.array(z.date()),
});

async function deleteAMAP(data: z.infer<typeof deleteSchema>) {
  return await safeServerAction({
    data,
    schema: deleteSchema,
    getUser: checkAdmin,
    serverAction: async ({ id, shippingDays }) => {
      await prismadb.aMAPOrder
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

      // if (dateOfShipping) {
      //   const event = await createOrdersEvent({ date: dateOfShipping });
      //   if (!event.success) {
      //     console.log(event.message);
      //   }
      // }
      revalidateTag("amap-orders");

      return {
        success: true,
        message: "Commande AMAP supprimé",
      };
    },
  });
}
export { deleteAMAP };
