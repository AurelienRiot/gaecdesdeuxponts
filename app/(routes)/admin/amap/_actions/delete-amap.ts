"use server";
import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import { revalidateAmap } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";

const deleteSchema = z.object({
  id: z.string().optional(),
  nextShippingDay: z.date().optional().nullable(),
});

async function deleteAMAP(data: z.infer<typeof deleteSchema>) {
  return await safeServerAction({
    data,
    schema: deleteSchema,
    roles: ADMIN,
    serverAction: async ({ id, nextShippingDay }) => {
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

      // if (nextShippingDay) {
      //   const event = await createOrdersEvent(nextShippingDay);
      //   if (!event.success) {
      //     console.log(event.message);
      //   }
      // }
      revalidateAmap();

      return {
        success: true,
        message: "Commande AMAP supprimé",
      };
    },
  });
}
export { deleteAMAP };
