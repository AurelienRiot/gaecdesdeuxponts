"use server";

import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { type ShopFormValues, schema } from "../_components/shop-schema";
import { ADMIN } from "@/components/auth";

async function createShop(data: ShopFormValues) {
  return await safeServerAction({
    schema,
    data,
    roles: ADMIN,
    serverAction: async (data) => {
      const sameShop = await prismadb.shop.findUnique({
        where: {
          id: data.id,
        },
      });
      if (sameShop) {
        return {
          success: false,
          message: "Un magasin avec ce nom existe déja",
        };
      }

      await prismadb.shop.create({
        data,
      });

      revalidateTag("shops");
      return {
        success: true,
        message: "Magasin creé",
      };
    },
  });
}

export default createShop;
