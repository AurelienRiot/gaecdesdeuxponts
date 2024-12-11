"use server";

import { SHIPPING_ONLY } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { type ShopFormValues, schema } from "../_components/shop-schema";
import { sanitizeId } from "@/lib/id";

async function createShop(data: ShopFormValues) {
  return await safeServerAction({
    schema,
    data,
    roles: SHIPPING_ONLY,
    serverAction: async ({ links, shopHours, userId, ...data }) => {
      const id = sanitizeId(data.name);
      const [sameShop, sameUser] = await Promise.all([
        prismadb.shop.findFirst({
          where: {
            OR: [{ name: data.name }, { id: id }],
          },
        }),
        prismadb.shop.findUnique({
          where: {
            userId: userId,
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
        data: {
          ...data,
          id,
          userId: userId ? userId : undefined,
          links: { create: links },
          shopHours: { create: shopHours },
        },
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
