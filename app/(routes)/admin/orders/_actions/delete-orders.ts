"use server";
import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";

const deleteSchema = z.object({
  id: z.string().optional(),
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

      return {
        success: true,
        message: "Commande supprimé",
      };
    },
  });
}
export { deleteOrder };
