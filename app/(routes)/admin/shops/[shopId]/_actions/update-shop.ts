"use server";

import { SHIPPING_ONLY } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidatePath, revalidateTag } from "next/cache";
import { type ShopFormValues, schema } from "../_components/shop-schema";

async function updateShop(data: ShopFormValues) {
  return await safeServerAction({
    schema,
    data,
    roles: SHIPPING_ONLY,
    serverAction: async ({ links, shopHours, userId, ...data }) => {
      const sameUser = await prismadb.shop.findFirst({
        where: {
          userId: userId,
        },
      });
      if (sameUser && userId && sameUser.userId !== userId) {
        return {
          success: false,
          message: "Un magasin avec ce client existe déja",
        };
      }
      await Promise.all([
        prismadb.link.deleteMany({
          where: {
            shopId: data.id,
          },
        }),
        prismadb.shopHours.deleteMany({
          where: {
            shopId: data.id,
          },
        }),
        prismadb.shop.update({
          where: {
            id: data.id,
          },
          data: {
            ...data,
            userId: userId ? userId : undefined,
            links: { create: links },
            shopHours: { create: shopHours },
          },
        }),
      ]);

      revalidateTag("shops");
      revalidatePath(`/ou-nous-trouver`);
      return {
        success: true,
        message: "Magasin mis à jour",
      };
    },
  });
}

export default updateShop;
