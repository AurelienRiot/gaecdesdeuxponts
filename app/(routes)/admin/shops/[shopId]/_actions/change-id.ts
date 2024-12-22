"use server";

import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import { revalidateShops } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import * as z from "zod";

const schema = z.object({
  id: z.string(),
  newId: z.string(),
});

async function changeShopId(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    schema,
    roles: ADMIN,
    serverAction: async ({ newId, id }) => {
      const [shop, existingShop] = await Promise.all([
        await prismadb.shop.findUnique({
          where: {
            id,
          },
          select: {
            id: true,
          },
        }),
        await prismadb.shop.findUnique({
          where: {
            id: newId,
          },
        }),
      ]);

      if (!shop) {
        return {
          success: false,
          message: "Magasin introuvable",
        };
      }

      if (existingShop) {
        return {
          success: false,
          message: "Un magasin avec cet email existe déja",
        };
      }

      try {
        await prismadb.shop.update({
          where: {
            id,
          },
          data: {
            id: newId,
          },
        });
      } catch (error) {
        return {
          success: false,
          message: "Une erreur est survenue",
        };
      }
      revalidateShops(id);

      return {
        success: true,
        message: "Identifiant du magasin mis à jour",
      };
    },
  });
}

export default changeShopId;
