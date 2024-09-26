"use server";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
});

async function deleteShop(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    schema,
    roles: ["admin"],
    serverAction: async (data) => {
      const { id } = data;
      const orders = await prismadb.order.findMany({
        where: {
          shopId: id,
          deletedAt: null,
        },
      });

      if (orders.length > 0) {
        return {
          success: false,
          message: "Des commandes sont associés à  ce magasin, supprimer les commandes où archiver ce magasin",
        };
      }

      const shop = await prismadb.shop.deleteMany({
        where: {
          id,
        },
      });

      if (shop.count === 0) {
        return {
          success: false,
          message: "Une erreur est survenue",
        };
      }

      revalidateTag("shops");
      return {
        success: true,
        message: "Magasin supprimé",
      };
    },
  });
}

export default deleteShop;
