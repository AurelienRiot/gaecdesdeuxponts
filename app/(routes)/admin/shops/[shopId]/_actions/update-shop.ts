"use server";

import safeServerAction from "@/lib/server-action";
import { type ShopFormValues, schema } from "../_components/shop-schema";
import { checkAdmin } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import { revalidateTag } from "next/cache";

async function updateShop(data: ShopFormValues) {
  return await safeServerAction({
    schema,
    data,
    getUser: checkAdmin,
    serverAction: async (data) => {
      await prismadb.shop.update({
        where: {
          id: data.id,
        },
        data,
      });

      revalidateTag("shops");
      return {
        success: true,
        message: "Magasin mise à jour",
      };
    },
  });
}

export default updateShop;
