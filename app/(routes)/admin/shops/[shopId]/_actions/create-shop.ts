"use server";

import { SHIPPING_ONLY } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { type ShopFormValues, schema } from "../_components/shop-schema";

async function createShop(data: ShopFormValues) {
  return await safeServerAction({
    schema,
    data,
    roles: SHIPPING_ONLY,
    serverAction: async ({ links, shopHours, ...data }) => {
      const [sameShop, sameUser] = await Promise.all([
        prismadb.shop.findFirst({
          where: {
            name: data.name,
          },
        }),
        prismadb.shop.findFirst({
          where: {
            userId: data.userId,
          },
        }),
      ]);
      if (sameUser) {
        return {
          success: false,
          message: "Un magasin avec ce client existe déja",
        };
      }
      if (sameShop) {
        return {
          success: false,
          message: "Un magasin avec ce nom existe déja",
        };
      }

      await prismadb.shop.create({
        data: { ...data, links: { create: links }, shopHours: { create: shopHours } },
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
