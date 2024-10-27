"use server";

import { SHIPPING_ONLY } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { type ShopFormValues, schema } from "../_components/shop-schema";

async function updateShop(data: ShopFormValues) {
  return await safeServerAction({
    schema,
    data,
    roles: SHIPPING_ONLY,
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
        message: "Magasin mis à jour",
      };
    },
  });
}

export default updateShop;
