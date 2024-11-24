"use server";
import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const linkShopSchema = z.object({
  shopId: z.string(),
  userId: z.string(),
});

async function linkShop(data: z.infer<typeof linkShopSchema>) {
  return await safeServerAction({
    data,
    schema: linkShopSchema,
    roles: ADMIN,
    serverAction: async ({ userId, shopId }) => {
      await prismadb.shop.update({
        where: {
          id: shopId,
        },
        data: {
          userId,
        },
      });
      revalidateTag("shops");
      revalidateTag("users");
      return {
        success: true,
        message: "Magasin lié au client",
      };
    },
  });
}

export default linkShop;
